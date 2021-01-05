from app import db
from models import User, Deck, Nugget, Keyword, Fakeout
from sqlalchemy import text

db.drop_all()
db.create_all()

db.session.commit()

myself = User.signup(username="testaccount",
                        password="secret",
                        email="artain5@gmail.com")
deck1 = Deck(name="Washington Facts",description="Facts about the great state of Washington",visibility="Public",user_id=myself.id)
deck2 = Deck(name="Tennessee Facts",description="Facts about the great state of Tennessee",visibility="Private",user_id=myself.id)
deck3 = Deck(name="Kansas Facts",description="Facts about the great state of Kansas",visibility="Public",user_id=myself.id)

nugget1 = Nugget(truth="Eastern Tennessee has many mountains",user_id=1)
keyword1 = Keyword(word="mountains",place_in_sentence=8,instance_count="1x",my_nugget=1)
keyword2 = Keyword(word="mountains",instance_count="All",my_nugget=1)
fakeout1=Fakeout(fake_word="laws against skateboarding",hypernym="some places",relationship="HasA",my_keyword_id=1)
fakeout2=Fakeout(fake_word="rivers",my_keyword_id=2)
fakeout3=Fakeout(fake_word="jungles",my_keyword_id=2)
fakeout4=Fakeout(fake_word="deserts",my_keyword_id=2)

nugget2 = Nugget(truth="Tennessee is known as the Volunteer state",user_id=1)
keyword3 =  Keyword(word="Volunteer",instance_count="All",my_nugget=2)
fakeout5=Fakeout(fake_word="Trombone",my_keyword_id=3)
fakeout6=Fakeout(fake_word="Evergreen",my_keyword_id=3)
fakeout7=Fakeout(fake_word="Sunflower",my_keyword_id=3)

db.session.add(deck1)
db.session.add(deck2)
db.session.add(deck3)
db.session.add(nugget1)
db.session.add(nugget2)
db.session.add(keyword1)
db.session.add(keyword2)
db.session.add(keyword3)
db.session.add(fakeout1)
db.session.add(fakeout2)
db.session.add(fakeout3)
db.session.add(fakeout4)
db.session.add(fakeout5)
db.session.add(fakeout6)
db.session.add(fakeout7)
db.session.commit()

deck2.my_nuggets.append(nugget1)
deck2.my_nuggets.append(nugget2)
db.session.commit()