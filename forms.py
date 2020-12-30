from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, TextAreaField, SelectField
from wtforms.validators import DataRequired, Email, Length

class UserAddForm(FlaskForm):
    """Form for adding users"""
    username = StringField('Username',validators=[DataRequired()])
    email = StringField('E-mail', validators=[DataRequired(), Email()])
    password = PasswordField('Password', validators=[Length(min=6)])

class LoginForm(FlaskForm):
    """Login form."""
    username = StringField('Username', validators=[DataRequired()])
    password = PasswordField('Password', validators=[Length(min=6)])

class CreateDeckForm(FlaskForm):
    """Create a new deck"""
    deckname = StringField('Deck Name',validators=[DataRequired()])
    description = StringField('')
    visibility = SelectField(label="Visibility",choices=[("Public","Public"),("Private","Private")])

class CreateNuggetForm(FlaskForm):
    """Form so that nuggets aren't made by a malicious user"""
