FROM resin/raspberry-pi-alpine
ENV TANGLE_ADDRESS=JCEGOJWWQFGUGQNCTDXXZHTPRPOCRLROHMYXZTLLDBORIOYCZOZYRSCMZSPRSPJZUMP9QDWZQPAYAOLHD
COPY . /app
WORKDIR /app

RUN echo @v3.3 http://nl.alpinelinux.org/alpine/v3.3/main > /etc/apk/repositories
RUN apk update

RUN apk add bash@v3.3 --no-cache
RUN apk add python-dev@v3.3 python3-dev@v3.3 --no-cache 

RUN echo @testing http://nl.alpinelinux.org/alpine/edge/testing >> /etc/apk/repositories
RUN apk update

RUN apk add py-smbus@testing

RUN echo @community http://nl.alpinelinux.org/alpine/edge/community >> /etc/apk/repositories
RUN apk update

RUN apk add py-rpigpio@community


RUN apk add i2c-tools --no-cache
CMD python lightsensor_iota.py
