#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char *ssid = "ConForNode";
const char *password = "12345678";

const char *serverUrl = "https://expressjs-with-sheet-logging.gurkirat7092.repl.co/api/add/node1"; // Server Url to Post

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

  String jsonPayload;                  // String to hold the JSON payload
  serializeJson(payload, jsonPayload); // converting the JSON to a string

  WiFiClientSecure client;
  HTTPClient http; // create the http client object

  client.setInsecure(); // Ignore SSL certificate verification if self-signed

  http.begin(client, serverUrl); // connect to the server
  http.addHeader("Content-Type", "application/json"); // set the content type header

  Serial.println("Sending HTTP POST request...");
  int httpResponseCode = http.POST(jsonPayload); // send the request

  Serial.print("HTTP response code: ");
  Serial.println(httpResponseCode);
  Serial.println(jsonPayload);

  http.end();

  delay(5000);
}
