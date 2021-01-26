//const separateWordsRegEx = /(\w|'|-)+|(\W)+/gmu;
const separateWordsRegEx = /([^\s\(]*\S*[^\s.,\)])|(\)*\W\(*)/gm;
const wordMatchRegEx = /(\w|'|-)+/;

let globalNugget;


function digestRawData() {
    if (nugget_var != null && nugget_var.truth != null) {
        globalNugget = new Nugget(nugget_var.truth,
            nugget_var.user_id, [],
            nugget_var.id);
        for (kword_var of nugget_var.keywords) {
            let keyword = new Keyword(kword_var.word,
                kword_var.loc,
                kword_var.instance_count,
                kword_var.part_of_speech, [], [],
                kword_var.id);
            for (fakeout_var of kword_var.fakeouts) {
                let fakeout = new Fakeout(fakeout_var.fake_word,
                    fakeout_var.hypernym,
                    fakeout_var.relationship,
                    fakeout_var.id);
                keyword.fakeouts.push(fakeout);
                keyword.hypernyms.push(fakeout_var.hypernym)
            }
            globalNugget.keywords.push(keyword);
        }
    }
}

/** 
 * 
 */
function digestNugget() {
    $(".nugget-err").text("");
    let nugget_text = $("#nugget").text();
    $('#nugget').html("");
    let wordArray = nugget_text.match(separateWordsRegEx);
    let clumpNum = 0;
    let candidateWords = [];
    if (wordArray) {
        for (word of wordArray) {
            if (wordMatchRegEx.test(word)) {
                span = $("<span>").addClass("candidate-word").attr("id", `clump-${clumpNum}`).text(word);
                $("#nugget").append(span)
                candidateWords.push(word);
            } else {
                span = $("<span>").addClass("grammar").attr("id", `clump-${clumpNum}`).text(word);
                $("#nugget").append(span)
            }
            clumpNum++;
        }
    }

    //update global variable of Nugget
    if (globalNugget == null) {
        globalNugget = new Nugget(nugget_text);
    } else {
        globalNugget.truth = nugget_text
        let updatedKeywords = []
        for (keyword of globalNugget.keywords) {
            if (checkIfWordInNugget(keyword.word)) {
                updatedKeywords.push(keyword);
            }
        }
        globalNugget.keywords = updatedKeywords;
    }

    //load new suggestions into autocomplete
    $("#kwEntry").autocomplete({ source: candidateWords });

    //update the UI panels. Delete any that aren't relevant anymore
    $(".validKeyword").toArray().forEach((elem) => {
        if (!checkIfWordInNugget($(elem).text()) && $(elem).text() != "") {
            $(elem).parentElement.remove();
        }
    })

    return;
}

async function loadDeckChoices() {
    let choices = [];
    let response = await axios.get("/api/get_my_decks");
    $.each(response.data.decks, function(i, item) {
        $('#targetDeck').prepend($('<option>', { value: item.id, text: item.name }));
    });
}


/** 
 *FUNCTIONS TO ADD A NEW KEYWORD TO THE UI AND THE GLOBAL nugget VARIABLE 
 */

//helper function
function checkIfWordInNugget(word) {
    let found = false;
    let placement = "";
    $(".candidate-word").each(function(index) {
        if ($(this).text() == word) {
            found = true;
            placement = $(this).attr("id")
        }
    })
    if (!found) {
        return false;
    } else { return placement; }
}

//helper function
function checkIfKwordInList(word) {
    return $(".validKeyword").toArray().map(x => x.innerText).includes(word);
}

function addTypedKeyword() {
    $("#errKwEntry").text("")
    let word = $("#kwEntry").val();
    let found = checkIfWordInNugget(word);
    if (!found) {
        //The word isn't in the nugget
        $("#errKwEntry").text("Keyword does not exist in nugget")
        return;
    }
    let placement = found.slice(6);
    makeAppendKwCard(word, loc = placement);
    $("#kwEntry").val("");
}

function handleNuggetDblclick(e) {
    if (e.target.classList.contains("candidate-word")) {
        let kword = e.target.textContent;
        let loc = e.target.id.slice(6);
        makeAppendKwCard(kword, instCountNum = "1x", loc = loc);
    }
}

//adds a new keyword card with replacement word entry
function makeAppendKwCard(word, instCountNum = "All", loc = "", partOfSpeech = "None") {

    //Update the UI first
    if (checkIfKwordInList(word)) return;
    let container = $("<div>").addClass('card-body col-3 mx-3 position-relative border-right border-left border-primary text-center').attr("data-keyword", word);
    let kwordDiv = $("<div>").addClass('card-text mb-0 mr-1 text-center').text(word);
    let delButton = $("<button>").addClass("deleteKeyword btn-close position-absolute top-0 end-0").attr({ "type": "button", "aria-label": "Close" });
    let partOfSpeechBadge = $("<span>").addClass('badge bg-secondary partOfSpeech').append($("<small>").text("part of speech")).text(partOfSpeech);
    let instanceCountBadge = $("<span>").addClass('badge bg-secondary instanceCount').text(instCountNum);
    let fakeoutsDiv = $("<div>").addClass("fakeouts")
    let fakeoutEntryDiv = $("<div>").addClass("ui-widget").append($("<label>").attr("for", `fakeoutEntry-${word}`).text("Enter a new replacement word here")).append($("<br>"))
    let fakeoutEntryInput = $("<input>").attr("type", "text").attr("name", `fakeoutEntry-${word}`).attr("id", `fakeoutEntry-${word}`)
    let submitFakeout = $("<button>").addClass("btn btn-success d-inline addFakeout").text("Add")
    fakeoutEntryDiv.append(fakeoutEntryInput);
    fakeoutsDiv.append(fakeoutEntryDiv);
    fakeoutsDiv.append(submitFakeout)
    container.append(kwordDiv).append(delButton).append(partOfSpeechBadge).append(instanceCountBadge).append(fakeoutsDiv);

    //Update the global variable of nugget
    let keyword = new Keyword(word, loc, instCountNum, partOfSpeech);
    globalNugget.keywords.push(keyword);
    loadFakeoutsIntoAutoComplete(keyword, fakeoutEntryInput);


    //Add the finished keyword block into the UI
    $("#chosen-keywords").append(container);

}

async function loadFakeoutsIntoAutoComplete(keyword, textInput) {
    let searchWord = {
        "sWord": keyword.word.toLowerCase(),
        "partOfSpeech": keyword.partOfSpeech,
        "instanceCount": keyword.instanceCount,
        "loc": keyword.placeInSentence
    };
    let response = await axios.post("/get_fakeout", json = {
        "words": [searchWord]
    }).then(function(data) {
        let fakeouts = data.data.fakeoutResults[0];
        let fakeoutsList = [];
        for (fakeoutGroup of fakeouts.cohyponyms) {
            let hypernym = fakeoutGroup.hypernym.label;
            let relationship = fakeoutGroup.hypernym.rel
            for (fakeout of fakeoutGroup.hyponyms) {
                let fakeword = fakeout.label
                let newFakeout = new Fakeout(fakeword, hypernym, relationship);
                fakeoutsList.push(newFakeout);
            }
        }
        keyword.autocompleteFakeouts = fakeoutsList;
        textInput.autocomplete({ source: keyword.autocompleteFakeouts.map((elem) => elem.word) });
    }).catch(function(err) {
        console.log("An error was encountered");
        console.log(err);
    });
}

function handleAddKwBtn(e) {
    e.preventDefault();
    addTypedKeyword();
}

function handlekwdkeypress(e) {

    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        e.preventDefault();
        addTypedKeyword();
    }
}


function handleKwdDelPress(e) {
    if (e.target.tagName == "BUTTON") {
        let removalKeyword = e.target.parentElement.dataset.keyword
        globalNugget.keywords = globalNugget.keywords.filter(kword => kword.word != removalKeyword);
        e.target.parentElement.remove();
    }
}

/** 
 *FUNCTIONS TO ADD A NEW FAKEOUT TO THE UI AND THE GLOBAL nugget VARIABLE 
 */

//Code to add a fakeout
function addFakeout(e) {
    let inputElement = e.target.parentElement.querySelector("input");
    let fakeoutText = inputElement.value;
    let keywordText = inputElement.id.slice(13);

    inputElement.value = "";
    let keyword = globalNugget.keywords.find(elem => elem.word == keywordText);
    if (keyword == undefined) {
        console.log("Something's wrong");
        throw Error("No Keyword??");
    }
    let fakeout = keyword.fakeouts.find(elem => elem.word == fakeoutText);
    if (fakeout == undefined) {
        //create new fakeout
        fakeout = new Fakeout(fakeoutText)
        keyword.fakeouts.push(fakeout);
    } else {
        // use existing fakeout
        keyword.fakeouts.push(fakeout);
    }
    let uiElement = $("<span>").addClass("fakeout bg-success my-2 mr-1 d-block").text(fakeoutText).append($("<span>").append($("<button>").addClass("btn-close btn-close-white deleteFakeout").attr("type", "button").attr("aria-label", "Close"))).attr("data-fakeout", fakeoutText);
    $(inputElement.parentElement).before(uiElement);
}

function handleFakeoutDelPress(e) {
    e.preventDefault();

    let fakeoutText = e.target.parentElement.parentElement.dataset.fakeout
    let keywordText = e.target.parentElement.parentElement.parentElement.parentElement.dataset.keyword;

    //Remove the fakeout from the globalNugget
    let keyword = globalNugget.keywords.find(elem => elem.word == keywordText);
    let fakeoutList = keyword.fakeouts.filter(elem => elem.word != fakeoutText);
    keyword.fakeouts = fakeoutList;

    //Remove the UI element
    e.target.parentElement.parentElement.remove()
}

function fkwordKeyPress(e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        addFakeout(e);
    }
}

/** 
 *FUNCTIONS TO ADD DETAILS TO THE KEYWORD 
 */

function handleKwlistclick(e) {
    e.preventDefault();
    if (e.target.tagName == "BUTTON") {
        e.target.parentElement.remove();
    } else if (e.target.classList.contains("instanceCount")) {
        let instanceCounter = e.target.innerText;
        if (instanceCounter == "1x") {
            e.target.innerText = "All";
        } else {
            e.target.innerText = "1x";
        }
    } else if (e.target.tagName == "SPAN") {
        let partOfSpeechElement;
        if (e.target.classList.contains("validKeyword")) {
            partOfSpeechElement = e.target.querySelector(".partOfSpeech");
        } else if (e.target.classList.contains("partOfSpeech")) {
            partOfSpeechElement = e.target;
        } else if (e.target.classList.contains("wordContent")) {
            partOfSpeechElement = e.target.parentElement.querySelector(".partOfSpeech");
        }
        switch (partOfSpeechElement.innerText) {
            case "":
                partOfSpeechElement.innerText = "N";
                break;
            case "N":
                partOfSpeechElement.innerText = "V";
                break;
            case "V":
                partOfSpeechElement.innerText = "Adj";
                break;
            case "Adj":
                partOfSpeechElement.innerText = "Adv";
                break;
            default:
                partOfSpeechElement.innerText = "";
        }

    }
}

/** 
 *FUNCTIONS TO ARRANGE DECK RELATIONSHIPS IN THE UI 
 */

function handleaddtoDeck(e) {
    e.preventDefault();
    let id = $("#targetDeck").val();
    let name = $("#targetDeck option:selected").text();
    let badge = $("<span>").addClass("deckAdd badge bg-success").text(name);
    badge.attr("id", id);
    let delButton = $("<button>").addClass("btn-close btn-close-white").attr({ "type": "button", "aria-label": "Close" });
    badge.append(delButton);
    $("#saveToDecks").append(badge);
}

function handleSavedDecksclick(e) {
    e.preventDefault();
    if (e.target.tagName == "BUTTON") {
        e.target.parentElement.remove();
    }
}


/** 
 *PACKAGE UP AND CLOSE
 */
async function saveAndClose(e) {
    e.preventDefault();
    token = $('#csrf_token').val()
    if (globalNugget.truth == "") {
        $(".nugget-err").text("The nugget field cannot be empty to submit");
        return;
    }

    submission = { csrf_token: token, Decks: [], truth: globalNugget.truth, user_id: globalNugget.userId, Keywords: [] }
    keywordArray = [];
    fakeoutArray = [];
    $(".deckAdd").each(function(index) {
        submission.Decks.push($(this).attr("id"));
    })

    submission.keywords = globalNugget.keywords.map((kwrd) => {
        return {
            word: kwrd.word,
            loc: kwrd.placeInSentence,
            instanceCount: kwrd.instanceCount,
            part_of_speech: kwrd.partOfSpeech,
            id: kwrd.id,
            fakeoutsuggestions: kwrd.autocompleteFakeouts,
            fakeouts: kwrd.fakeouts.map((fakeword) => {
                return {
                    fakeWord: fakeword.word,
                    hypernym: fakeword.hypernym,
                    relationship: fakeword.relationship,
                    id: fakeword.id
                }
            })
        }
    })
    let resp;
    if (globalNugget.id == -1) {
        resp = await axios.post("/nuggets/create", json = { "submission": submission });
    } else {
        resp = await axios.post(`/nuggets/view/${globalNugget.id}`, json = { "submission": submission });
    }

    if (resp.status == 200) { window.location.replace('/'); } else {
        $('#errSaveandClose').text("An error occured with saving this nugget");

    }
}


/**
 * General handler for a user clicking within the keyword fakeout distraction panel 
 */
function handleDistractionClick(e) {
    if (e.target.classList.contains("deleteKeyword")) {
        handleKwdDelPress(e);
    } else if (e.target.classList.contains("deleteFakeout")) {
        handleFakeoutDelPress(e);
    } else if (e.target.classList.contains("addFakeout")) {
        addFakeout(e);
    }
}

function handleDistractionKeyPress(e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        if (e.target.classList.contains("typedFakeEntry")) {
            addFakeout(e);
        }
    }
}


$(function() {
    digestRawData();

    digestNugget();


    loadDeckChoices();
    //Event for when the nugget has just been updated
    $("#nugget").focusout(digestNugget);

    //These events all handle adding a new keyword
    $("#checkAddKeywordEntry").click(handleAddKwBtn);
    $("#nugget").dblclick(handleNuggetDblclick);

    //Handles a click or enter-press anywhere within the distractionpanel
    $("#chosen-keywords").click(handleDistractionClick);
    $("#chosen-keywords").keypress(handleDistractionKeyPress);

    //These events all handle adding a new fakeout within a keyword
    $("#typedNewFakeoutWd").keypress(fkwordKeyPress);
    $("#kwEntry").keypress(handlekwdkeypress);
    $("#KwList").click(handleKwlistclick);

    //These events handle adding and removing deck assignment
    $("#addToDeck").click(handleaddtoDeck);
    $("#saveToDecks").click(handleSavedDecksclick);

    // This event saves 
    $("#saveMe").click(saveAndClose)
})