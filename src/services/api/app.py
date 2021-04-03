from model.user import User
from flask import Flask, render_template, request, jsonify, redirect, url_for
from controller.user_controller import user_controller
from database import db
from flask_login import login_user, logout_user
from login.login_manager import login_manager
from flask_login import current_user
import requests
import json
import os 

TEMPLATE = './templates'
STATIC = './static'

app = Flask(__name__, static_url_path='', template_folder=TEMPLATE, static_folder=STATIC)
app.register_blueprint(user_controller)

login_manager.init_app(app)

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///./dbtest.db'
db.init_app(app)

app.secret_key = 'supersecretkey'
app.config['SESSION_TYPE'] = 'filesystem'

with app.app_context():
  db.create_all()

def dir_last_updated(folder):
    return str(max(os.path.getmtime(os.path.join(root_path, f))
                   for root_path, dirs, files in os.walk(folder)
                   for f in files))

@app.route("/teste")
def teste():
  
  return {"message": "ok, connected!"}

@app.route("/")
def index():
  return render_template('index.html')
  
  #if not hasattr(current_user, 'id'):
  #  return render_template("login.html")
  #else:
  #  return render_template("index.html")

productsOnCart = []

@app.route("/addToCart", methods=['POST'])
def addToCart():
  global productsOnCart  
  print("adicionar ao carrinho", productsOnCart)
  data = request.json
  dscProduto = data["dscProduto"]
  codGetin = data["codGetin"]
  newProduct = {"dscProduto": dscProduto, "codGetin": codGetin, "qtd": 1}
  productsOnCart.append(newProduct)
  print("carrinho: ", productsOnCart)
  return jsonify({"message": "product added"})

@app.route("/productsOnCart", methods=['GET'])
def productsOnCart():
  return jsonify({"productsOnCart": productsOnCart})

@app.route("/changeQuantity", methods=['POST'])
def changeQuantity():
  data = request.json
  operation = data["operation"]
  codGetin = data["codGetin"]

  print("O codigo é ", codGetin, "e a operação: ", operation)
  for product in productsOnCart:
    if product["codGetin"] == codGetin:
      if operation == "sub" and product["qtd"] != 1:
        product["qtd"] -= 1
        return jsonify({"message": "subtracted"})
      elif operation == "sum":
        product["qtd"] += 1
        return jsonify({"message": "added"})
      break


@app.route("/deleteProduct", methods=['POST'])
def deleteProduct():
  global productsOnCart
  print("chegou pra excluir")

  data = request.json
  codGetin = data["codGetin"]

  print("removendo produto com o código: ", codGetin)

  for product in productsOnCart:
    if product["codGetin"] == codGetin:
      productsOnCart.remove(product)    
      return jsonify({"message": "deleted"})
      break

  print("Produtos no carrinho: ", productsOnCart)
  

@app.route("/searchMarket", methods=['POST'])
def searchMarket():
  print("produtos a procurar: ", productsOnCart)
  return jsonify(productsOnCart)

@app.route("/products", methods=['GET', 'POST'])
def products():
  if request.method == "POST":
    pass

  else:
    newProducts = []

    #page = request.args.get('page', 1)
    
    productDescription = request.args.get('q')
    print("descricao do produto: ", productDescription)
    url = "http://api.sefaz.al.gov.br/sfz_nfce_api/api/public/consultarPrecosPorDescricao"
    header = {"appToken": "7be9c184660a004d6ec383b11c50e16b02981bd0"}
    payload = {"descricao": productDescription,"dias": 1,"latitude": -9.6432331,"longitude": -35.7190686,"raio": 15}
    response = requests.post(url, headers=header, json=payload)

    products = response.json()

    productsDescriptions = []
    productsCodes = []

    for product in products:
      print("o código é: ", product["codGetin"])
      #if product["dscProduto"].lower() in productsDescriptions and product["codGetin"] not in productsCodes:
      #  for productVerification in newProducts:
      #    if productVerification["dscProduto"] == product["dscProduto"]:
      #      productVerification["codsGetin"].append(product["codGetin"])
      #      productsCodes.append(product["codGetin"])

      # or product["dscProduto"] in productsDescriptions
      if product["codGetin"] == None or product["codGetin"] == "" or product["codGetin"].upper() == "SEM GTIN" or product["codGetin"][-13:] in productsCodes:
        continue

      else:
        productsDescriptions.append(product["dscProduto"].lower())
        productsCodes.append(product["codGetin"][-13:])

        newProduct = {"dscProduto": product["dscProduto"], "codGetin": product["codGetin"][-13:]}
        newProducts.append(newProduct)

    #print("codigos do produto: ", productsCodes)
    #print("nomes do produto: ", productsDescriptions)
    #print("os novos produtos: ", newProducts)
    return jsonify(newProducts);

  

  
  #if not hasattr(current_user, 'id'):
  #  return render_template("login.html")
  #else:
  #  return render_template("index.html")


@app.route("/login", methods=['POST'])
def home():
  error = None
  if request.method == 'POST':
    users = User.query.filter_by(email=request.form['email'])
    if not users.first() == None:
      user = users.first()
      if user.password == request.form['password']:
        login_user(user, remember=True)
        return render_template('index.html') 
      else:
        error = 'Invalid Credentials. Please try again.'
    else:
      error = 'Invalid Credentials. Please try again.'
  return render_template('login.html', error=error)

@app.route("/register", methods=['GET', 'POST'])
def register ():
  if request.method == 'GET':
    return render_template('register.html')
  else: 
    pass

@app.route("/logout", methods=['GET'])
def logout():
  logout_user()
  return render_template('login.html')



app.run()