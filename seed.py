from app import db
from models import User, Deck

db.drop_all()
db.create_all()

db.session.commit()

myself = User.signup(username="artain",
                        password="secret",
                        email="artain5@gmail.com")
deck1 = Deck(name="Badger",description="A ground animal",visibility="Public",user_id=myself.id)
deck2 = Deck(name="Flying bird",description="A sky animal",visibility="Private",user_id=myself.id)
deck3 = Deck(name="Squid",description="A water animal",visibility="Public",user_id=myself.id)

db.session.add(deck1)
db.session.add(deck2)
db.session.add(deck3)
db.session.commit()