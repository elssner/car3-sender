function Servosteuerung (pWinkel: number) {
    if (pWinkel >= 45 && pWinkel <= 135) {
        btSendeZahl = pWinkel
        _4digit.clear()
        _4digit.point(false)
        zeigeZiffern(pWinkel, 1)
    }
}
input.onGesture(Gesture.TiltRight, function () {
    if (iRichtung > 0 && iMotorV < 100) {
        iMotorV += 5
    } else if (iRichtung < 0 && iMotorR < 100) {
        iMotorR += 5
    }
    Motorsteuerung()
})
input.onButtonEvent(Button.AB, ButtonEvent.LongClick, function () {
    basic.showString("1BS8")
})
radio.onReceivedNumber(function (receivedNumber) {
    btLaufzeit = input.runningTime()
    if (receivedNumber == 2001) {
        basic.showIcon(IconNames.Surprised)
    } else if (receivedNumber == 2003) {
        basic.showIcon(IconNames.StickFigure)
    } else if (receivedNumber >= 2000) {
        basic.showNumber(receivedNumber - 2000)
    }
})
input.onGesture(Gesture.ScreenDown, function () {
    iWinkel = 90
    Servosteuerung(iWinkel)
})
function Motorsteuerung () {
    if (iRichtung > 0) {
        btSendeZahl = iMotorV + 1000
    } else if (iRichtung < 0) {
        btSendeZahl = iMotorR * -1 + 1000
    } else {
        btSendeZahl = 1000
    }
    AnzeigeMotor()
}
input.onButtonEvent(Button.A, input.buttonEventClick(), function () {
    if (iWinkel < 135) {
        iWinkel += 5
    }
    Servosteuerung(iWinkel)
})
function zeigeZiffern (iZahl: number, iStelle: number) {
    sZahl = convertToText(iZahl)
    if (sZahl.length == 1) {
        _4digit.bit(0, iStelle)
        _4digit.bit(parseFloat(sZahl.charAt(0)), iStelle + 1)
    } else if (sZahl.length == 2) {
        _4digit.bit(parseFloat(sZahl.charAt(0)), iStelle)
        _4digit.bit(parseFloat(sZahl.charAt(1)), iStelle + 1)
    } else if (sZahl.length == 3) {
        if (iStelle == 1) {
            _("1 Servo - Zahl steht in der Mitte, rechte Ziffer (Stelle 3) ist aus")
            _4digit.bit(parseFloat(sZahl.charAt(0)), 0)
            _4digit.bit(parseFloat(sZahl.charAt(1)), 1)
            _4digit.bit(parseFloat(sZahl.charAt(2)), 2)
        } else {
            _("0 2 Motor - 3 Ziffern - zeigt anstatt 100% nur 1_ - zweite Ziffer ist aus")
            _4digit.bit(parseFloat(sZahl.charAt(0)), iStelle)
        }
    } else {
        _4digit.clear()
    }
}
input.onGesture(Gesture.TiltLeft, function () {
    if (iRichtung > 0 && iMotorV > 0) {
        iMotorV += -5
    } else if (iRichtung < 0 && iMotorR > 0) {
        iMotorR += -5
    }
    Motorsteuerung()
})
input.onButtonEvent(Button.AB, input.buttonEventClick(), function () {
    iRichtung = 0
    Motorsteuerung()
    if (iMotorV > 90) {
        iMotorV = 60
    }
    if (iMotorR > 80) {
        iMotorR = 50
    }
})
input.onButtonEvent(Button.B, input.buttonEventClick(), function () {
    if (iWinkel > 45) {
        iWinkel += -5
    }
    Servosteuerung(iWinkel)
})
function _ (Kommentar: string) {
	
}
input.onButtonEvent(Button.A, ButtonEvent.Hold, function () {
    if (!(input.buttonIsPressed(Button.B))) {
        iRichtung = 1
        Motorsteuerung()
    }
})
input.onButtonEvent(Button.B, ButtonEvent.Hold, function () {
    if (!(input.buttonIsPressed(Button.A))) {
        iRichtung = -1
        Motorsteuerung()
    }
})
function AnzeigeMotor () {
    _4digit.clear()
    _4digit.point(true)
    zeigeZiffern(iMotorV, 0)
    zeigeZiffern(iMotorR, 2)
    if (iRichtung > 0) {
        basic.showIcon(IconNames.ArrowNorth)
    } else if (iRichtung < 0) {
        basic.showIcon(IconNames.ArrowSouth)
    } else {
        basic.showIcon(IconNames.SmallDiamond)
    }
}
let sZahl = ""
let iWinkel = 0
let iRichtung = 0
let iMotorR = 0
let iMotorV = 0
let btSendeZahl = 0
let btLaufzeit = 0
let _4digit: grove.TM1637 = null
_4digit = grove.createDisplay(DigitalPin.C16, DigitalPin.C17)
_4digit.set(7)
radio.setGroup(60)
let btConnected = false
btLaufzeit = input.runningTime()
btSendeZahl = 1000
iMotorV = 60
iMotorR = 50
iRichtung = 0
iWinkel = 90
AnzeigeMotor()
loops.everyInterval(500, function () {
    if (input.runningTime() - btLaufzeit < 1000) {
        if (!(btConnected)) {
            btConnected = true
            basic.setLedColor(0x00ff00)
        }
    } else {
        btConnected = false
        if (Math.trunc(input.runningTime() / 1000) % 2 == 1) {
            basic.setLedColor(0x0000ff)
        } else {
            basic.turnRgbLedOff()
        }
    }
})
loops.everyInterval(200, function () {
    radio.sendNumber(btSendeZahl)
    _("45 ... 135 Servo; 90 ist geradeaus")
    _("900 ... 1100 Motor; 1000 ist 0%")
})
