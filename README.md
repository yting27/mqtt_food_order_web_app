# Food Ordering Web App (MQTT)

This web app receives MQTT message from IOT device (see [food_order_mbed_mqtt](https://github.com/yting27/food_order_mbed_mqtt)). This project is only setup for local network.


## Installation & Setup
1. Install Node.js: [nodejs.org](https://nodejs.org/en/download/)
2. Clone web app repository 
    ```
    git clone https://github.com/yting27/mqtt_food_order_web_app.git 
    ```
3. Change directory:
    ```
    cd mqtt_food_order_web_app
    ```
4. Install dependencies: 
    ```bash
    npm install 
    ```
5. Install Mosquitto based on your platform: [Eclipse Mosquitto](https://mosquitto.org/download/)
6. Append Mosquitto installation path to the environment variable of "Path" (in Windows) or "PATH" (in Linux).
7. Add two lines to mosquitto.conf file, which can be found in Mostqutto installation path.
    ```
    // ...
    listener 1883 
    allow_anonymous true
    ```
8. Make sure the current device is discoverable by IoT device(s) in the same network. 
    For example, in Windows, set your Wi-Fi network to "Private": <br />
    <img src="./images/network-private.png" alt="screenshot" width="400"/>


## Running application

1. Please run Mosquitto with the following command: 
    ```bash
    mosquitto -v -c "<path-to>\mosquitto\mosquitto.conf"
    ```
2. Then, start the web app by executing `npm start`
3. Open browser and visit http://localhost:3000 


## Other Information 

1. Data is stored in SQLite database located at `utils\proj_db.db`. To view the table data, you might install SQLite extension in VS Code (if VS Code is the IDE used). 
