import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import train_test_split
from sklearn import tree
from sklearn.metrics import accuracy_score
from flask import Flask, request, jsonify
import joblib

from flask_cors import CORS

data = pd.read_csv('../../matches.csv')

label_encoded_team1 = LabelEncoder()
label_encoded_team2 = LabelEncoder()
label_encoded_venue = LabelEncoder()
label_encoded_winner = LabelEncoder()

data['team1'] = label_encoded_team1.fit_transform(data['team1'])
data['team2'] = label_encoded_team2.fit_transform(data['team2'])
data['venue'] = label_encoded_venue.fit_transform(data['venue'])
data['winner'] = label_encoded_winner.fit_transform(data['winner'])

model = DecisionTreeClassifier()

X = data[['team1','team2','venue']]

Y = data[['winner']]    

x_train,x_test,y_train,y_test = train_test_split(X,Y,test_size=0.3,random_state=42)

t = model.fit(x_train,y_train)

tree.plot_tree(t)

y_pred = model.predict(x_test)

accuracy = accuracy_score(y_test, y_pred)

# lines from below are for prediction
# ================

# sample_data = pd.DataFrame({
#     'team1': [label_encoded_team1.transform(['Sunrisers Hyderabad'])[0]],  # Replace 'TeamA' with a valid team name from your data
#     'team2': [label_encoded_team2.transform(['Kolkata Knight Riders'])[0]],  # Replace 'TeamB' with a valid team name from your data
#     'venue': [label_encoded_venue.transform(['Narendra Modi Stadium, Ahmedabad'])[0]]  # Replace 'Venue1' with a valid venue name from your data
# })

# prediction = model.predict(sample_data)
# predicted_winner = label_encoded_winner.inverse_transform(prediction)
# print(f"Prediction for sample data: {predicted_winner[0]}")

# ================

joblib.dump(model, 'model.joblib')
joblib.dump(label_encoded_team1, 'label_encoder_team1.joblib')
joblib.dump(label_encoded_team2, 'label_encoder_team2.joblib')
joblib.dump(label_encoded_venue, 'label_encoder_venue.joblib')
joblib.dump(label_encoded_winner, 'label_encoder_winner.joblib')

app = Flask(__name__)

CORS(app)

# Load the model and encoders
model = joblib.load('model.joblib')
label_encoded_team1 = joblib.load('label_encoder_team1.joblib')
label_encoded_team2 = joblib.load('label_encoder_team2.joblib')
label_encoded_venue = joblib.load('label_encoder_venue.joblib')
label_encoded_winner = joblib.load('label_encoder_winner.joblib')

@app.route('/predict', methods=['POST'])
def predict():
    data = request.get_json()
    print(data)
    team1 = data['team1']
    team2 = data['team2']
    venue = data['venue']
    
    team1_encoded = label_encoded_team1.transform([team1])[0]
    team2_encoded = label_encoded_team2.transform([team2])[0]
    venue_encoded = label_encoded_venue.transform([venue])[0]
    
    prediction = model.predict([[team1_encoded, team2_encoded, venue_encoded]])
    predicted_winner = label_encoded_winner.inverse_transform(prediction)[0]
    
    return jsonify({'winner': predicted_winner})

if __name__ == '__main__':
    app.run(debug=True)
