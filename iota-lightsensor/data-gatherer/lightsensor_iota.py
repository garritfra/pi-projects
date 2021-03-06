#!/usr/bin/env python3

import RPi.GPIO as GPIO
import smbus

import os
import time
import requests
import json
import threading

iotaAddress = os.environ["TANGLE_ADDRESS"]

address = 0x48
bus = smbus.SMBus(1)
cmd = 0x40
ledPin = 11


def analogRead(chn):
    value = bus.read_byte_data(address, cmd+chn)
    return value


def analogWrite(value):
    bus.write_byte_data(address, cmd, value)


def setup():
    global p
    GPIO.setmode(GPIO.BOARD)
    GPIO.setup(ledPin, GPIO.OUT)
    GPIO.output(ledPin, GPIO.LOW)

    p = GPIO.PWM(ledPin, 1000)
    p.start(0)


def loop():
    while True:
        data = []
        for _ in range(5):
            time.sleep(5)
            value = analogRead(0)
            p.ChangeDutyCycle(value*100/255)
            voltage = value / 255.0 * 3.3
            data.append({"voltage": voltage, "value": value, "timestamp": {
                        "unix": int(time.time()), "readable": time.ctime()}})
            print("voltage: " + str(voltage), "value: " + str(value))
        threading.Thread(target=postToTangle, args=(data,)).start()


def postToTangle(data):
    print("Posting data to IOTA")
    print(data)
    requests.post('http://localhost:1234/',
                  json={"address": iotaAddress, "data": data})
    print("data has been uploaded to IOTA")


def destroy():
    bus.close()
    GPIO.cleanup()


if __name__ == '__main__':
    print('Program is starting ... ')
    setup()
    try:
        loop()
    except KeyboardInterrupt:
        destroy()
