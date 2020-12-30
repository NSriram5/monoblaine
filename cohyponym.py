import requests

forward_hypernyms = ['IsA','AtLocation','LocatedNear','MannerOf','RecievesAction','MadeOf','SymbolOf','CreatedBy','ObstructedBy','Causes','CapableOf','UsedFor']

def do_requests(words):
    limiter = 120
    hypernym_collection = []
    for word in words:
        if limiter <= 0:
            break
        text_word = word.get("sWord")
        part_of_speech_dict = {"n":"/n","v":"/v","adj":"/a","adv":"/r"}
        partofspeech = part_of_speech_dict.get(word.get("partOfSpeech"),"")
        instance_count = word.get("instanceCount")
        loc = word.get("loc")
        word_dict = {"text_word":text_word,"part_of_speech":partofspeech,"hypernyms":[],"cohyponyms":[],"antonyms":[],"instance_count":instance_count,"loc":loc}
        hypernyms = collect_hypernyms(text_word,partofspeech)
        limiter -= 1
        empty_hypernyms = []
        for hypernym in hypernyms:
            if limiter <= 0:
                break
            cohyponyms = collect_fakeouts(hypernym,partofspeech,text_word,hypernyms)
            limiter -= 1
            if len(cohyponyms)==0:
                empty_hypernyms.append(hypernym)
            else:
                word_dict["cohyponyms"].append(cohyponyms)
        strong_cohyponyms = find_strong_cohyponyms(word_dict["cohyponyms"])
        for ehypernym in empty_hypernyms:
            hypernyms.remove(ehypernym)
        
        word_dict["hypernyms"]=hypernyms
        hypernym_collection.append(word_dict)
    return hypernym_collection

def collect_hypernyms(kword,partofspeech):
    """Identify hyponyms given a word and a part of speech"""
    url = f"http://api.conceptnet.io/query?node=/c/en/{kword}{partofspeech}&limit=1000"
    concept_net_5_resp = requests.get(url)

    concept_net_5_resp = concept_net_5_resp.json()
    edges = concept_net_5_resp.get('edges')
    hypernyms = read_hypernym_edges(edges,kword)

    hypernyms = remove_duplicate_hypernyms(hypernyms)

    return hypernyms

def collect_fakeouts(hypernym,part_of_speech,keyword,hypernyms):
    """Accept an array of string words and return an array of fakeout words"""
    fakeouts = []
    address = hypernym['addr']
    relationship = hypernym['rel']
    url = f"http://api.conceptnet.io/query?node={address}&rel=/r/{relationship}&limit=25"
    concept_net_5_resp = requests.get(url).json()

    edges = concept_net_5_resp.get('edges')

    hypernym_addresses = [word['addr'] for word in hypernyms]
    fakeouts = read_cohyponym_edges(edges,keyword,hypernym,hypernym_addresses)

    #If there are too many fakeout or too few, then this might not be a good hypernym to use
    if len(fakeouts)==0 or len(fakeouts)>20:
        return []
    hypernym_tree = {'hypernym':hypernym,'hyponyms':fakeouts}    
    return hypernym_tree

def remove_articles(words):
    word = word.replace("a ","").replace("the ","").replace("an ","")
    return word

def read_hypernym_edges(edges,kword):
    hypernyms = []
    backwards_hypernyms = ['HasA']
    for edge in edges:
        label = ''
        rel = ''
        if edge.get('weight') >= 1.0:
            rel = edge.get('rel').get('label')
            weight = edge.get('weight')
            pointer = ""
            if (rel in forward_hypernyms and f'/c/en/{kword}' in edge.get('start').get('@id')):
                pointer = "end"
  
            elif (rel in backwards_hypernyms and f'/c/en/{kword}' == edge.get('end').get('@id')):
                #import pdb; pdb.set_trace()
                pointer = "start"

            if pointer!="":
                label = edge.get(f'{pointer}').get('label')
                addr = edge.get(f'{pointer}').get('@id')
                weight = round(weight,2)
                hypernyms.append({'label':label,'rel':rel,'addr':addr,'weight':weight})
    return hypernyms

def remove_duplicate_hypernyms(hypernym_list):
    vertices = []
    for hyp in hypernym_list:
        if hyp['label'] in vertices:
            hypernym_list.remove(hyp)
        else:
            vertices.append(hyp['label'])
    return hypernym_list

def read_cohyponym_edges(edges,kword,hypernym,hypernym_addresses):
    position1,position2 = "",""
    fakeouts = []
    if hypernym.get('rel') in forward_hypernyms:
        position2 = "start"
        position1 = "end"
    elif hypernym.get('rel') in ['HasA']:
        position1 = "start"
        position2 = "end"
    for edge in edges:
        if edge.get(position2).get("term") != f'/c/en/{kword}' and edge.get(position2).get("@id") not in hypernym_addresses:
            label = edge.get(position2).get("label")
            if label.lower().find('a ',0,2)!=-1:
                label = label[2:]
            if label.lower().find('the ',0,4)!=-1:
                label = label[4:]
            if label.lower().find('an ',0,3)!=-1:
                label = label[3:]
            weight = edge.get("weight")
            weight = round(weight,2)
            fakeouts.append({'label':label,"weight":edge.get("weight")})
    return fakeouts        

def find_strong_cohyponyms(nyms):
    strong = []
    found = []
    for hyper in nyms:
        for word in hyper['hyponyms']:
            if word['label'] in found and word['label'] not in strong:
                strong.append(word['label'])
            else:
                found.append(word['label'])
    return strong