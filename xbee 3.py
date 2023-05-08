from digi.xbee.devices import XBeeDevice
from digi.xbee.io import IOLine, IOMode

# Instantiate an XBee device object for the coordinator
device = XBeeDevice("COM3", 9600)

# Open the serial port
device.open()

# Set the pin configuration for AD0
device.set_io_configuration(IOLine.DIO2_AD2, IOMode.ADC)

# Continuously read and print the data received from the sensor
while True:
    try:
        # Wait for and retrieve the next available analog sample
        sample = device.get_adc_value(IOLine.DIO2_AD2)
        print("Temperature:", sample)
    except KeyboardInterrupt:
        break

# Close the serial port
device.close()