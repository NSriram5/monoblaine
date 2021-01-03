//const separateWordsRegEx = /(\w|'|-)+|(\W)+/gmu;
const separateWordsRegEx = /([^\s\(]*\S*[^\s.,\)])|(\)*\W\(*)/gm;
const wordMatchRegEx = /(\w|'|-)+/g;


function digestNugget() {
    let nugget = $("#nugget").text();
    $('#nugget').html("");
    sessionStorage.setItem("nugget", nugget);
    let wordArray = nugget.match(separateWordsRegEx);
    let clumpNum = 0;
    let candidateWords = [];
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
    sessionStorage.setItem("candidateWords", candidateWords)
    $("#kwEntry").autocomplete({ source: candidateWords });
    return;
}

async function loadDeckChoices() {
    let choices = [];
    let response = await axios.get("/api/get_decks");
    $.each(response.data.decks, function(i, item) {
        $('#targetDeck').prepend($('<option>', { value: item.id, text: item.name }));
    });
}

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

function addKeyword() {
    $("#errKwEntry").text("")
    let word = $("#kwEntry").val();
    let found = checkIfKwordInNugget(word);
    let placement = "";
    if (!found) {
        //The word isn't in the nugget
        $("#errKwEntry").text("Keyword does not exist in nugget")
        return;
    }
    makeAppendKwBadge(word, loc = placement);
    $("#kwEntry").val("");

}

function checkIfKwordInList(word) {
    return $(".validKeyword>.wordContent").toArray().map(x => x.innerText).includes(word);
}

function makeAppendKwBadge(word, instCountNum = "All", loc = "") {
    if (checkIfKwordInList(word)) return;
    let kWordBadge = $("<span>").addClass('validKeyword badge bg-secondary');
    let kWord = $("<span>").text(word).addClass('wordContent')
    let delButton = $("<button>").addClass("btn-close btn-close-white").attr({ "type": "button", "aria-label": "Close" });
    let instCount = $("<span>").addClass('instanceCount ms-2').text(instCountNum).attr("data-loc", loc);
    let partSpeech = $("<span>").text("").addClass("partOfSpeech");
    kWordBadge.append(kWord).append(delButton).append(partSpeech).append(instCount);
    $("#KwList").append(kWordBadge);
}

async function lookupAllFakeouts() {
    let searchWords = [];
    $(".validKeyword").each(function(index) {
        part = $(this).find(".partOfSpeech").text();
        word = $(this).find(".wordContent").text();
        instanceCount = $(this).find(".instanceCount").text();
        loc = $(this).find(".instanceCount").attr("data-loc");
        item = { "sWord": word.toLowerCase(), "partOfSpeech": part, "instanceCount": instanceCount, "loc": loc }
        searchWords.push(item);
    })
    debugger;
    let response = await axios.post("/get_fakeout", json = { "words": searchWords })
    let fakeouts = response.data.fakeoutResults;
    for (keyword of fakeouts) {
        let label = keyword.text_word;
        let wordCard = $('<div>').addClass('card col-6').attr('id', `card-${label}`);
        let cardBody = $('<div>').addClass('card-body');
        let cardHeader = $('<h3>').addClass('card-title').text(label).attr('data-instancesCount', keyword.instance_count).attr('data-loc', keyword.loc);
        let listRoot = $("<div>").addClass('d-flex flex-row flex-wrap');
        let clsButton = $("<button>").addClass("btn-close position-absolute top-0 end-0").attr({ "type": "button", "aria-label": "Close" });
        for (group of keyword.cohyponyms) {
            let flexcontainer = $('<div>').addClass('hypernym-box col-4');
            let hypernymRoot = $('<ul>').addClass('hypernym h6').append($('<u>').text(group.hypernym.label).attr('data-rel', group.hypernym.rel)).append($('<span>').text(group.hypernym.weight).addClass('hypernym-weight mx-2'));
            flexcontainer.append(hypernymRoot);
            let i = 0;
            for (hyponym of group.hyponyms) {
                if (i >= 5) { break; }
                let word = hyponym.label;
                let fakeout = $('<li>').addClass('fakeout').text(word);
                let add = $('<i>').addClass("far fa-plus-square");
                hypernymRoot.append(fakeout.append(add));
                i++;
            }
            listRoot.append(flexcontainer);
        }
        cardBody.append(cardHeader).append(listRoot);
        wordCard.append(cardBody).append(clsButton);
        $('#fakeout-suggestions').append(wordCard);
    }
}

function handleNuggetDblclick(e) {
    if (e.target.classList.contains("candidate-word")) {
        let kword = e.target.textContent;
        let loc = e.target.id.slice(6);
        makeAppendKwBadge(kword, instCountNum = "1x", loc = loc);
    }
}

function handleAddKwBtn(e) {
    e.preventDefault();
    addKeyword();
}

function handleClickAddFakeoutButton(e) {
    e.preventDefault();
    addFinishedFakeout();
}

function addFinishedFakeout() {
    let kword = $('#typedNewFakeoutKw').val();
    let fword = $('#typedNewFakeoutWd').val();
    if (kword == "" && fword == "") {
        $('#errFakeoutEntry').text("Both Keyword and replacement word are empty");
        return;
    } else if (kword == "") {
        $('#errFakeoutEntry').text("The Keword can't be empty");
        return;
    } else if (fword == "") {
        $('#errFakeoutEntry').text("The Replacement word can't be empty");
        return;
    } else if (!checkIfWordInNugget(kword)) {
        $('#errFakeoutEntry').text("The entered Keyword can't be found in the nugget");
        return;
    } else if (!checkIfKwordInList(kword)) {
        makeAppendKwBadge(kword);
    }
    $('#typedNewFakeoutKw').val("");
    $('#typedNewFakeoutWd').val("");
    let instanceCount = "All";
    let displayCard = $("<div>").addClass("finishedFakeout card col-2");
    let cardText = $("<p>").addClass("card-text mb-0").text(`Replace ${kword} with ${fword}`);
    let instances = $("<p>").addClass("card-text mb-0").text(instanceCount);
    let clsButton = $("<button>").addClass("btn-close position-absolute top-0 end-0").attr({ "type": "button", "aria-label": "Close" });
    displayCard.append($("<div>").addClass("card-body").append(cardText).append(instances)).append(clsButton);
    displayCard.attr("data-keyword", kword);
    displayCard.attr("data-fakeoutword", fword);
    displayCard.attr("data-hypernym", "");
    displayCard.attr("data-instancescount", instanceCount);
    displayCard.attr("data-relationship", "");
    displayCard.attr("data-loc", "");
    $("#finalizedfakeouts").append(displayCard);
}

function handleFakeOutRefreshAllBtn(e) {
    e.preventDefault();
    lookupAllFakeouts();
}

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

async function saveAndClose(e) {
    e.preventDefault();
    token = $('#csrf_token').val()
    submission = { csrf_token: token, Decks: [], Nugget: $("#nugget").text(), Keywords: [] }
    keywordArray = [];
    fakeoutArray = [];
    $(".deckAdd").each(function(index) {
        submission.Decks.push($(this).attr("id"));
    })
    $(".finishedFakeout").each(function(index) {
        let fakeout = $(this).attr("data-fakeoutword");
        let hypernym = $(this).attr("data-hypernym");
        let keyword = $(this).attr("data-keyword");
        let relationship = $(this).attr("data-relationship");
        let loc = $(this).attr("data-loc");
        let instanceCount = $(this).attr("data-instancesCount");
        if (!keywordArray.includes(`${keyword}-${loc}-${instanceCount}`)) {
            keywordArray.push(`${keyword}-${loc}-${instanceCount}`);
            let fakeoutData = { text: fakeout, hypernym: hypernym, relationship: relationship }
            fakeoutArray.push(`${keyword}-${loc}-${instanceCount}-${fakeout}-${hypernym}-${relationship}`)
            submission.Keywords.push({ text: keyword, loc: loc, instanceCount: instanceCount, fakeouts: [fakeoutData] })
        } else {
            if (!fakeoutArray.includes(`${keyword}-${loc}-${instanceCount}-${fakeout}-${hypernym}-${relationship}`)) {
                let fakeoutData = { text: fakeout, hypernym: hypernym, relationship: relationship };
                fakeoutArray.push(keyword + loc + instanceCount + fakeout + hypernym + relationship);
                let index = keywordArray.findIndex((s) => s == `${keyword}-${loc}-${instanceCount}`);
                submission.Keywords[index].fakeouts.push(fakeoutData);
            }
        }
    });
    let resp = await axios.post("/nuggets/create", json = { "submission": submission });
    if (resp.status == 200) { window.location.replace('/'); } else {
        $('#errSaveandClose').text("An error occured with saving this nugget");

    }
}

function handlefakeoutsuggestionsclick(e) {
    e.preventDefault(e);
    if (e.target.tagName == "BUTTON") {
        e.target.parentElement.remove();
    } else if (e.target.parentElement.classList.contains("fakeout") || e.target.classList.contains("fakeout")) {
        let fakeout;
        let targ;
        if (e.target.classList.contains("fakeout")) {
            targ = e.target;
        } else {
            targ = e.target.parentElement;
        }
        fakeout = targ.innerText;
        let hypernym = targ.parentElement.firstElementChild.innerText;
        let relationship = targ.parentElement.firstElementChild.dataset.rel;
        let keyword = targ.closest(".card-body").firstElementChild.innerText;
        let instanceCount = targ.closest(".card-body").firstElementChild.dataset.instancescount;
        let loc = targ.closest(".card-body").firstElementChild.dataset.loc;
        let displayCard = $("<div>").addClass("finishedFakeout card col-2");
        let cardText = $("<p>").addClass("card-text mb-0").text(`
                                Replace $ { keyword }
                                with $ { fakeout }
                                `);
        let hypernymText = $("<p>").addClass("card-text mb-0").text(`
                                Shared concept is $ { hypernym }
                                `);
        let instances = $("<p>").addClass("card-text mb-0").text(instanceCount);
        let relationText = $("<p>").addClass("card-text mb-0").text(`
                                Shared relationship: $ { relationship }
                                `);
        let clsButton = $("<button>").addClass("btn-close position-absolute top-0 end-0").attr({ "type": "button", "aria-label": "Close" });
        displayCard.append($("<div>").addClass("card-body").append(cardText).append(hypernymText).append(instances).append(relationText)).append(clsButton);
        displayCard.attr("data-keyword", keyword);
        displayCard.attr("data-fakeoutword", fakeout);
        displayCard.attr("data-hypernym", hypernym);
        displayCard.attr("data-instancescount", instanceCount);
        displayCard.attr("data-relationship", relationship);
        displayCard.attr("data-loc", loc);
        $("#finalizedfakeouts").append(displayCard);
    }
}

function handleDeleteFinishedFakeout(e) {
    if (e.target.tagName == "BUTTON") {
        e.target.parentElement.remove();
    }
}

function handlekwdkeypress(e) {
    //e.preventDefault();
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        addKeyword();
    }
}

function fkwordKeyPress(e) {
    if ((e.which && e.which == 13) || (e.keyCode && e.keyCode == 13)) {
        addFinishedFakeout();
    }
}

$(function() {
    digestNugget();
    loadDeckChoices();
    $("#nugget").focusout(digestNugget);
    $("#checkAddKwEntry").click(handleAddKwBtn);
    $("#checkAddFakeoutEntry").click(handleClickAddFakeoutButton);
    $("#typedNewFakeoutWd").keypress(handleAddFinishedFakeout);
    $("#kwEntry").keypress(handlekwdkeypress);
    $("#suggestionsRefreshAll").click(handleFakeOutRefreshAllBtn);
    $("#KwList").click(handleKwlistclick);
    $("#nugget").dblclick(handleNuggetDblclick);
    $("#fakeout-suggestions").click(handlefakeoutsuggestionsclick);
    $("#finalizedfakeouts").click(handleDeleteFinishedFakeout);
    $("#addToDeck").click(handleaddtoDeck);
    $("#saveToDecks").click(handleSavedDecksclick);
    $("#saveMe").click(saveAndClose)
})