#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* ssid = "Node ";
const char* password = "whyitellyou";
const char* serverUrl = "http://192.168.1.100:3000/api/add/node2";

void setup() {
  Serial.begin(9600);
  WiFi.begin(ssid, password);

  while (WiFi.status() != WL_CONNECTED) {
    delay(1000);
    Serial.println("Connecting to WiFi...");
  }
  Serial.println("Connected to WiFi");
}

void loop() {


  int value1 = random(100);
  int value2 = random(100);


  DynamicJsonDocument payload(1024);
  payload["value1"] = value1;
  payload["value2"] = value2;

  String jsonPayload;
  serializeJson(payload, jsonPayload);

  WiFiClient client;

  HTTPClient http;
  http.begin(client, serverUrl);
  http.addHeader("Content-Type", "application/json");
  int httpResponseCode = http.POST(jsonPayload);
  http.end();

  Serial.print("HTTP response code: ");
  Serial.println(httpResponseCode);
Serial.println(jsonPayload);
  
  delay(5000);
}
