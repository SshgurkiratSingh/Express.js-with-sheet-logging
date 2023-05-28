#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char *ssid = "Node ";
const char *password = "whyitellyou";

const char *serverUrl = "http://192.168.1.100:3000/api/add/node2"; // Server Url to Post

void setup()
{
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop()
{

  int value1 = random(100); // random value between 0 and 100
  int value2 = random(100); // random value between 0 and 100

  DynamicJsonDocument payload(1024); // allocate memory for the document
  payload["value1"] = value1;        // add the value to the payload
  payload["value2"] = value2;        // add the value to the payload

  String jsonPayload;                  // String to hold the JSON payLoad
  serializeJson(payload, jsonPayload); // converting the json to string

  WiFiClient client;
  HTTPClient http; // create the http client object

  http.begin(client, serverUrl);                      // connect to the server
  http.addHeader("Content-Type", "application/json"); // set the content type header
  int httpResponseCode = http.POST(jsonPayload);      // send the request
  http.end();                                         // close the connection

  Serial.print("HTTP response code: ");
  Serial.println(httpResponseCode);
  Serial.println(jsonPayload);

  delay(5000);
}
