"""SQLAlchemy model for nugget-quizzer"""
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import requests
#from secrets import wordnik_api_key
from cohyponym import read_hypernym_edges, remove_duplicate_hypernyms, read_cohyponym_edges

bcrypt = Bcrypt()
db = SQLAlchemy()

def connect_db(app):
    db.app = app
    db.init_app(app)


class Nugget(db.Model):
    """A nugget of truth"""
    __tablename__="nugget"

    id = db.Column(db.Integer,primary_key=True)
    truth = db.Column(db.Text,nullable=False)
    user_id = db.Column(db.Integer,db.ForeignKey('users.id',ondelete='CASCADE'),nullable=False)
    my_keywords = db.relationship('Keyword',backref='nugget')

    def to_dict(self):
        nug_dict = {"id":self.id,
                    "truth":self.truth,
                    "user_id":self.user_id,
                    "keywords":[]}
        nug_dict["keywords"]=[keyword.to_dict() for keyword in self.my_keywords]
        return nug_dict

    def update(self,json_new):
        ## list of old ids
        old_ids = [keyword.id for keyword in self.my_keywords]
        ## list of new ids
        new_ids = []
        for json_keyword in json_new.get("keywords"):
            if int(json_keyword.get("id")) in old_ids:
                new_ids.append(json_keyword.get("id"))
                keyword = Keyword.query.get(json_keyword.get("id"))
                keyword.update(json_keyword,self.id)
            if json_keyword.get("id",None) == None:
                keyword = Keyword.create_with_fakeouts(json_keyword,self.id)
                new_ids.append(keyword.id)
        for old_id in old_ids:
            if old_id not in new_ids:
                keyword = Keyword.query.get("old_id")
                db.session.delete(keyword)
                db.session.commit()
        
        self.truth = json_new.get("truth")
        self.user_id = json_new.get("user_id")
        old_deck_ids = [deck.id for deck in self.my_decks]
        new_deck_ids = []
        for deck_id in json_new.get("Decks",None):
            if deck_id not in old_deck_ids:
                deck = Deck.query.get(deck_id)
                self.my_decks.append(deck)
                db.session.commit()
                new_deck_ids.append(int(deck_id))
            else:
                new_deck_ids.append()
        for test_deck_id in old_deck_ids:
            if test_deck_id not in new_deck_ids:
                del_deck = Deck.query.get(test_deck_id)
                self.my_decks.remove(del_deck)
                db.session.commit()
        db.session.commit()
        return
        


class Keyword(db.Model):
    """Keywords attached"""
    __tablename__="keyword"
    id = db.Column(db.Integer,primary_key=True)
    word = db.Column(db.String(100),nullable=False)
    place_in_sentence = db.Column(db.Integer,nullable=True)
    instance_count = db.Column(db.String(10),nullable=True)
    part_of_speech = db.Column(db.String(5),nullable=True)
    hypernym = db.Column(db.Text)
    my_nugget = db.Column(db.Integer,db.ForeignKey('nugget.id',ondelete='cascade'))
    my_fakeouts = db.relationship('Fakeout')

    @classmethod
    def create_with_fakeouts(cls,json_new,nugg_id):
        loc = json_new.get("loc")
        if loc == "":
            loc = None
        keyword = Keyword(word = json_new.get("word"),
                            place_in_sentence = loc,
                            instance_count = json_new.get("instanceCount"),
                            part_of_speech = json_new.get("part_of_speech"),
                            my_nugget = nugg_id)
        db.session.add(keyword)
        db.session.commit()
        for input_fakeout in json_new.get("fakeouts"):
            Fakeout.create(input_fakeout,keyword.id)
        return keyword

    def to_dict(self):
        kword_dict = {"id":self.id,
                "word":self.word,
                "loc":self.place_in_sentence,
                "instance_count":self.instance_count,
                "part_of_speech":self.part_of_speech,
                "hypernym":self.hypernym,
                "fakeouts":[]}
        kword_dict["fakeouts"]=[fakeout.to_dict() for fakeout in self.my_fakeouts]
        return kword_dict

    def update(self,json_new,nug_id):
        
        ## list of old ids
        old_ids = [fakeout.id for fakeout in self.my_fakeouts]
        ## list of new ids
        new_ids = []
        for json_fakeout in json_new.get("fakeouts"):
            if json_fakeout.get("id") in old_ids:
                new_ids.append(json_fakeout.get("id"))
                fakeout = Fakeout.query.get(json_fakeout.get("id"))
                fakeout = fakeout.update(json_fakeout)
            if json_fakeout.get("id",None) == None:
                fakeout = Fakeout.create(json_fakeout,self.id)
                new_ids.append(fakeout.id)
        for old_id in old_ids:
            if old_id not in new_ids:
                fakeout = Fakeout.query.get(old_id)
                db.session.delete(fakeout)
                db.session.commit()
        
        self.word=json_new.get("word")
        self.my_nugget = nug_id
        if json_new.get("loc") != "" and json_new.get("loc") != None:
            self.place_in_sentence = int(json_new.get("loc"))
        if json_new.get("instanceCount") != "" and json_new.get("instanceCount") != None:
            self.instance_count=json_new.get("instanceCount")
        if json_new.get("part_of_speech") != "" and json_new.get("part_of_speech") != None:
            self.part_of_speech=json_new.get("part_of_speech")
        db.session.commit()
        return
        


class Fakeout(db.Model):
    """Fasqlkeout words"""
    __tablename__="fakeout"
    id = db.Column(db.Integer,primary_key=True)
    fake_word = db.Column(db.Text,nullable=False)
    hypernym = db.Column(db.Text)
    relationship = db.Column(db.String(20),nullable=True)
    my_keyword_id = db.Column(db.Integer,db.ForeignKey('keyword.id',ondelete='cascade'))
    my_keyword = db.relationship('Keyword')



    @classmethod
    def create(cls,json_new,kw_id):
        fakeout = Fakeout(fake_word = json_new.get("fakeWord"),
                    hypernym = json_new.get("hypernym"),
                    relationship = json_new.get("relationship"),
                    my_keyword_id = kw_id)
        db.session.add(fakeout)
        db.session.commit()
        return fakeout


    def __eq__(self,obj):
        return bool(self.id==obj.id)

    def update(self,json_update):
        self.fake_word = json_update.get("fakeWord")
        self.hypernym = json_update.get("hypernym")
        self.relationship = json_update.get("relationship")
        db.session.commit()
        return self

    def to_dict(self):
        fakeout_dict = {"id":self.id,
                        "fake_word":self.fake_word,
                        "hypernym":self.hypernym,
                        "relationship":self.relationship}
        return fakeout_dict

class Question(db.Model):
    """Questions"""
    __tablename__="question"
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(100),nullable=True)
    times_asked = db.Column(db.Integer,default=0)
    times_correct = db.Column(db.Integer,default=0)
    my_nugget = db.Column(db.Integer,db.ForeignKey('nugget.id',ondelete='cascade'))

class JoinDeckQuestion(db.Model):
    """Join between multiple decks and multiple questions"""
    __tablename__="joindeckquestion"
    id = db.Column(db.Integer,primary_key=True)
    my_question= db.Column(db.Integer,db.ForeignKey('question.id',ondelete='cascade')
    )
    my_deck = db.Column(db.Integer,db.ForeignKey('deck.id',ondelete='cascade'))

class JoinDeckQuiz(db.Model):
    """Join between multiple decks and multiple quizes"""
    __tablename__="joindeckquiz"
    id = db.Column(db.Integer,primary_key=True)
    my_quiz= db.Column(db.Integer,db.ForeignKey('quiz.id',ondelete='cascade')
    )
    my_deck = db.Column(db.Integer,db.ForeignKey('deck.id',ondelete='cascade'))

class JoinDeckNugget(db.Model):
    """Join between multiple decks and multiple nuggets"""
    __tablename__="joindecknugget"
    id = db.Column(db.Integer,primary_key=True)
    my_deck = db.Column(db.Integer,db.ForeignKey('deck.id',ondelete='cascade'))
    my_nugget = db.Column(db.Integer,db.ForeignKey('nugget.id',ondelete='cascade'))

class JoinDeckUser(db.Model):
    """Join between decks and collaborating users"""
    __tablename__="joindeckuser"
    id = db.Column(db.Integer,primary_key=True)
    my_deck = db.Column(db.Integer,db.ForeignKey('deck.id',ondelete='cascade'))
    access_user = db.Column(db.Integer,db.ForeignKey('users.id',ondelete='cascade'))

class Quiz(db.Model):
    """Quiz"""
    __tablename__="quiz"
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.Text,nullable=True)
    my_decks = db.relationship("Deck",secondary="joindeckquiz",primaryjoin=(JoinDeckQuiz.my_deck == id),)

class Deck(db.Model):
    """Deck, a group of quizes and questions"""
    __tablename__="deck"
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(100),nullable=False)
    visibility = db.Column(db.String(10),default="public",nullable=False)
    description = db.Column(db.Text,nullable=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id',ondelete='CASCADE'),nullable=False)
    my_questions = db.relationship("Question",secondary="joindeckquestion",primaryjoin=(JoinDeckQuestion.my_deck == id))
    my_nuggets = db.relationship("Nugget",secondary="joindecknugget",primaryjoin=(JoinDeckNugget.my_deck == id),backref="my_decks")
    my_users = db.relationship("User",secondary="joindeckuser",primaryjoin=(JoinDeckUser.my_deck == id),backref="my_decks")

class User(db.Model):
    """User in the system."""
    __tablename__='users'
    id = db.Column(db.Integer,primary_key=True,autoincrement=True)
    email = db.Column(db.Text,nullable=False,unique=True)
    username = db.Column(db.Text,nullable=False,unique=True)
    password = db.Column(db.Text,nullable=False)
    
    decks = db.relationship('Deck',cascade='all,delete, delete-orphan')
    nuggets = db.relationship('Nugget',cascade='all,delete, delete-orphan')

    def __repr__(self):
        return f"<User #{self.id}: {self.username}, {self.email}>"
    
    @classmethod
    def signup(cls,username,email,password):
        """Sign up user.
        Hashses password and adds user to system.
        """
        hashed_pwd = bcrypt.generate_password_hash(password).decode('UTF-8')

        user = User(
            username=username,
            email=email,
            password=hashed_pwd
        )
        db.session.add(user)
        user=cls.query.filter_by(username=username).first()
        return user

    @classmethod
    def authenticate(cls, username, password):
        """Find user with `username` and `password`.

        This is a class method (call it on the class, not an individual user.)
        It searches for a user whose password hash matches this password
        and, if it finds such a user, returns that user object.

        If can't find matching user (or if password is wrong), returns False.
        """
        user = cls.query.filter_by(username=username).first()

        if user:
            is_auth = bcrypt.check_password_hash(user.password, password)
            if is_auth:
                return user

        return False