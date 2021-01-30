class Nugget {
    constructor(truth, userId = -1, keywords = [], id = -1) {
        this.truth = truth;
        this.id = id;
        this.userId = userId;
        this.keywords = keywords;
    }
}

class Keyword {
    constructor(word, placeInSentence = null, instanceCount = "All", partOfSpeech = null, hypernyms = [], fakeouts = [], id) {
        this.word = word;
        this.placeInSentence = placeInSentence;
        this.instanceCount = instanceCount;
        this.partOfSpeech = partOfSpeech;
        this.fakeouts = fakeouts;
        this.autocompleteFakeouts = [];
        this.hypernyms = hypernyms;
        this.id = id;
    }
}

class Fakeout {
    constructor(word, hypernym = null, relationship = null, id = null) {
        this.word = word;
        this.hypernym = hypernym;
        this.relationship = relationship;
        this.id = id;
    }
}