import processing.io.*;

LED[] leds = new LED[10];
boolean isLedOn = false;
int counter = 0;
boolean goingUp = true;

void setup() {
  size(200, 200);
  fill(255, 0, 0);
  text("Click here to stop execution", 20, 20);
  ellipse(100, 100, 100, 100);
  
  frameRate(10);
  int[] pins = {4, 17, 27, 5, 6, 13, 19, 26, 21, 16};
  for(int i = 0; i < 10; i++) {
    leds[i] = new LED(pins[i]);
  }

}

void draw() {
  setGraph(counter);
  
  if(counter >= 10) {
    goingUp = false;
  } else if(counter <= 0)  {
    goingUp = true;
  }
  
  if(goingUp) {
    counter++;
  } else {
    counter--;
  }
}

void setGraph(int amount) {
  for(int i = 0; i < 10; i++) {
    if(i < amount) {
      leds[i].toggleOn();
    } else {
      leds[i].toggleOff();
    }
  }
}

void keyPressed() {
  
  for(int i = 0; i < 10; i++) {
    GPIO.releasePin(leds[i].getPin());
  }
  exit();
}

void mousePressed() {
  for(int i = 0; i < 10; i++) {
    GPIO.releasePin(leds[i].getPin());
  }
  exit();
}


class LED {
  private int pinNumber;
  private boolean isOn;
  
  public LED(int pinNumber) {
    this.pinNumber = pinNumber;
    this.isOn = false;
    GPIO.pinMode(pinNumber, GPIO.OUTPUT);
  }
  
  public void toggleOn() {
    this.isOn = true;
    GPIO.digitalWrite(this.pinNumber, GPIO.HIGH);
  }
  
  public void toggleOff() {
    this.isOn = false;
    GPIO.digitalWrite(this.pinNumber, GPIO.LOW);
  }
  
  public boolean isOn() {
    return this.isOn;
  }
  
  public int getPin() {
    return this.pinNumber;
  }

}
