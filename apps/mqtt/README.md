# MQTT Configuration

This directory contains the configuration files for the MQTT broker used in the Bera Beer project.

## Files

- `mosquitto.conf`: Main configuration file for the Mosquitto MQTT broker
- Other MQTT-related configuration files can be added here

## Usage

The configuration files in this directory are copied to the appropriate location by the `setup-mqtt` target in the project's Makefile.

```bash
# Setup MQTT configuration
make setup-mqtt
```

This ensures that the MQTT broker is properly configured when running the application.
