"""SQLAlchemy model for MonoBlaine"""
from flask_bcrypt import Bcrypt
from flask_sqlalchemy import SQLAlchemy
import requests
from secrets import wordnik_api_key
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

class Fakeout(db.Model):
    """Fasqlkeout words"""
    __tablename__="fakeout"
    id = db.Column(db.Integer,primary_key=True)
    fake_word = db.Column(db.Text,nullable=False)
    hypernym = db.Column(db.Text)
    relationship = db.Column(db.String(20),nullable=True)
    my_keyword_id = db.Column(db.Integer,db.ForeignKey('keyword.id',ondelete='cascade'))
    my_keyword = db.relationship('Keyword')

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