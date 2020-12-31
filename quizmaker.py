import random
import re

def make_quiz(deck):
    nugget_pool = []
    incoming_nuggets = deck.my_nuggets.copy()
    finished_questions = []
    safety = 50
    while len(incoming_nuggets)>0:
        nugget = random.choice(incoming_nuggets)
        #count if there's enough to be added to a question focused on this one nugget
        fakeout_distribution = [len(keyword.my_fakeouts) for keyword in nugget.my_keywords]
        total_fakeouts = sum(fakeout_distribution)
        fill_in_blank_potentials = [1 if x>=3 else 0 for x in fakeout_distribution]
        if total_fakeouts<=0:
            import pdb; pdb.set_trace()
        elif total_fakeouts<=2:
            #There aren't enough features in this nugget to make a fully formed question
            nugget_pool.append(nugget)
            incoming_nuggets.remove(nugget)
        elif sum(fill_in_blank_potentials)>=1:
            #There are enough features in this nugget to make at least one "fill in the blank" mc question
            questions = make_fill_in_blank_mc_questions(nugget)
            finished_questions = finished_questions + questions
            incoming_nuggets.remove(nugget)
        elif total_fakeouts>=3:
            #There are enough features in this nugget to make a "which is true?" mc question
            questions = make_which_is_true_question([nugget])
            finished_questions = finished_questions + questions
        safety = safety - 1
        if safety<1:
            import pdb; pdb.set_trace()
    questions = make_which_is_true_question(nugget_pool)
    finished_questions = finished_questions + questions
    return finished_questions

def make_which_is_true_question(nuggets):
    questions = []
    generation_list = []
    nuggets_used = []
    for nugget in nuggets:
        for keyword in nugget.my_keywords:
            for fakeout in keyword.my_fakeouts:
                generation_list.append((nugget.truth,keyword.word,keyword.instance_count,keyword.place_in_sentence,fakeout.fake_word))
    safety = 50
    while len(generation_list)>2 and len(nuggets)>0:
        wrong1 = random.choice(generation_list)
        generation_list.remove(wrong1)
        wrong2 = random.choice(generation_list)
        generation_list.remove(wrong2)
        wrong3 = random.choice(generation_list)
        generation_list.remove(wrong3)
        right_choice = random.choice(nuggets)
        nuggets.remove(right_choice)
        wrong_fill1 = refill_nugget(wrong1[0],wrong1[1],wrong1[2],wrong1[3],wrong1[4])
        wrong_fill2 = refill_nugget(wrong2[0],wrong2[1],wrong2[2],wrong2[3],wrong2[4])
        wrong_fill3 = refill_nugget(wrong3[0],wrong3[1],wrong3[2],wrong3[3],wrong3[4])
        question = {"prompt":"Which of these is true?","stripped_nugget":"","nugget_id":right_choice.id,"keyword_id":None,"answer_list":[wrong_fill1,wrong_fill2,wrong_fill3,right_choice.truth],"correct_answer":right_choice.truth}
        random.shuffle(question["answer_list"])
        questions.append(question)
        safety = safety - 1
        if safety<1:
            import pdb; pdb.set_trace()
    return questions


def make_fill_in_blank_mc_question(nugget,keyword):
    question = {"prompt":"Fill in the blank:","stripped_nugget":None,"nugget_id":nugget.id,"keyword_id":keyword.id,"answer_list":[],"correct_answer":keyword.word}
    stripped_nugget = refill_nugget(nugget.truth,keyword.word,keyword.instance_count,keyword.place_in_sentence)
    question["stripped_nugget"]=stripped_nugget
    safety = 50
    while len(question["answer_list"])<3:
        faker = random.choice(keyword.my_fakeouts).fake_word
        if faker not in question["answer_list"]:
            question["answer_list"].append(faker)
        safety = safety - 1
        if safety<1:
            import pdb; pdb.set_trace()
    question["answer_list"].append(question["correct_answer"])
    random.shuffle(question["answer_list"])
    
    return question

def make_fill_in_blank_mc_questions(nugget):
    questions = []
    for keyword in nugget.my_keywords:
        if len(keyword.my_fakeouts)>=3:
            question = make_fill_in_blank_mc_question(nugget,keyword)
            questions.append(question)
    return questions

def refill_nugget(text,kword,instance_count,place_in_sentence,refill="____"):
    if instance_count == "All":
        finished_text = text.replace(kword,refill)
        finished_text = finished_text.replace(f" a {refill}",f" a/an {refill}")
        finished_text = finished_text.replace(f" an {refill}",f" a/an {refill}")
        return finished_text
    elif instance_count == "1x":
        rx_wordsplit = re.compile(r'([^\s\(]*\S*[^\s.,\)])|(\)*\W\(*)',re.MULTILINE)
        finished_text = [clump for clump in rx_wordsplit.split(text) if clump]
        if finished_text[place_in_sentence-2] == "a" or finished_text[place_in_sentence-2] == "an":
            finished_text[place_in_sentence-2] = "a/an"
        finished_text[place_in_sentence] = f"{refill}"
        finished_text = "".join(finished_text)
        return finished_text
    else:
        raise RuntimeError