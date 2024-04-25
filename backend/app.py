from flask import Flask, request, jsonify, make_response
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from os import environ

app = Flask(__name__)
CORS(app) # This will enable CORS for all routes
# 調べる
app.config['SQLALCHEMY_DATABASE_URI']= environ.get('DATABASE_URL')
db = SQLAlchemy(app)

# DB Model
class User(db.Model):
    __tablename__ = 'users'
    id = db.Column(db.Integer,primary_key=True)
    name = db.Column(db.String(80),unique=True,nullable=False)
    email = db.Column(db.String(120),unique=True,nullable=False)

    def json(self):
        return {'id':self.id,'name':self.name,'email':self.email}
    

    # なんだこれ
db.create_all()


# create test
@app.route('/test',methods=['GET'])
def test():
    return jsonify({'message': 'The server is running'})


# create user
@app.route('/api/flask/users',methods=['POST'])
def create_user():
    try:
    # importしたrequestを使って、リクエストのjsonデータを取得
      data = request.get_json()
      new_user = User(name=data['name'],email=data['email'])
    # sessionはORMの機能で、データベースのセッションを表す。gitのcommitと同じ
      db.session.add(new_user)
      db.session.commit()

      return jsonify({
        'id' : new_user.id,
        'name' : new_user.name,
        'email': new_user.email
      }), 201

    except Exception as e:
       return jsonify({'message': 'Unable to create user'}), 500
  
# get all users
@app.route('/api/flask/users',methods=['GET'])
def get_users():
    try:
        users = User.query.all()
        # for文でusersの中身を取り出して、json()メソッドを使って、json形式に変換
        users_data = [{'id':user.id,'name':user.name,'email':user.email} for user in users]
        return jsonify(users_data), 200
    except Exception as e:
        return make_response({'message': 'Unable to get users'}, 500)   
    
# get user by id
@app.route('/api/flask/users/<id>',methods=['GET'])
def get_user_by_id(id):
    try:
        user = User.query.filter_by(id=id).first()  # get the first user with the id
        if user:
            return make_response(jsonify({'user':user.json()}),200)
        return make_response({'message': 'User not found'},404)
    except Exception as e:
        return make_response({'message': 'error getting user', 'error': str(e)},500)
    
# update user
@app.route('/api/flask/users/<id>',methods=['PUT'])
def update_user(id):
    try:
        data = request.get_json()
        user = User.query.filter_by(id=id).first()
        if user.id == data['id']:
            user.name = data['name']
            user.email = data['email']
            db.session.commit()
            return make_response(jsonify({'message':'user updated'}),200)
        return make_response({'message': 'User not found'},404) 
    except Exception as e:
        return make_response({'message': 'error updating user', 'error': str(e)},500)

# delete user 
@app.route('/api/flask/users/<id>',methods=['DELETE'])
def delete_user(id):
    try:
        user = User.query.filter_by(id=id).first()
        if user:
            db.session.delete(user)
            db.session.commit()
            return make_response(jsonify({'message':'user deleted'}),200)
        return make_response({'message': 'User not found'},404)
    except Exception as e:
        return make_response({'message': 'error deleting user', 'error': str(e)},500)