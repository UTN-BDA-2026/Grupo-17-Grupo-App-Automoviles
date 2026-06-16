import { Injectable } from '@nestjs/common';
import { VehicleInputDTO, VehicleOutputDTO } from '../interfaces/input_ml.dto';

@Injectable()
export class VehicleParserService {
  public parseVehicleData(data: any): VehicleOutputDTO {
    const input = data as VehicleInputDTO;

    return {
      brand: {
        name: input['Marca'],
      },
      model: {
        name: input['Modelo'],
      },
      vehicle: {
        year: this.parseNumberFromString(input['Año']),
        version: input['Versión'],
      },
      listing: {
        price: this.parseNumberFromString(input['precio']),
        currency: input['moneda'],
        is_available: true,
        mileage: this.parseNumberFromString(input['Kilómetros']),
        color: input['Color'],
        fuel_type: input['Tipo de combustible'],
        doors: this.parseNumberFromString(input['Puertas']),
        people_capacity: this.parseNumberFromString(
          input['Capacidad de personas'],
        ),
        condition: 'Usado',
        direction: input['Dirección'],
        transmission: input['Transmisión'],
        traction_control: input['Control de tracción'],
        engine: input['Motor'],
        body_type: input['Tipo de carrocería'],
        sole_owner: this.parseBooleanFromString(input['Único dueño']),
        equipment: {
          other_features: {
            autopilot: this.parseBooleanFromString(input['Piloto automático']),
            lights_on_alarm: this.parseBooleanFromString(
              input['Alarma de luces encendidas'],
            ),
            on_board_computer: this.parseBooleanFromString(
              input['Computadora de abordo'],
            ),
            battery_type: input['Tipo de batería'],
            battery_capacity: this.parseNumberFromString(
              input['Capacidad de la batería'],
            ),
            charging_time: this.parseNumberFromString(input['Tiempo de carga']),
            charger_type: input['Tipo de cargador'],
            battery_life: this.parseNumberFromString(
              input['Autonomia de la batería'],
            ),
          },
          security: {
            abs_brakes: this.parseBooleanFromString(input['Frenos ABS']),
            alarm: this.parseBooleanFromString(input['Alarma']),
            front_bumper: this.parseBooleanFromString(
              input['Defensa delantera'],
            ),
            driver_airbag: this.parseBooleanFromString(
              input['Airbag conductor'],
            ),
            airbag_for_driver_and_passenger: this.parseBooleanFromString(
              input['Airbag para conductor y pasajero'],
            ),
            rain_sensor: this.parseBooleanFromString(input['Sensor de lluvia']),
            rear_fog_lights: this.parseBooleanFromString(
              input['Faros antinieblas traseros'],
            ),
            rear_defroster: this.parseBooleanFromString(
              input['Desempañador trasero'],
            ),
            stability_control: this.parseBooleanFromString(
              input['Control de estabilidad'],
            ),
            third_led_brake_light: this.parseBooleanFromString(
              input['Tercera luz de freno led'],
            ),
            central_door_locking: this.parseBooleanFromString(
              input['Cierre centralizado de puertas'],
            ),
            backup_camera: this.parseBooleanFromString(
              input['Con cámara de retroceso'],
            ),
            armored: this.parseBooleanFromString(input['Blindado']),
          },
          confort: {
            air_conditioner: this.parseBooleanFromString(
              input['Aire acondicionado'],
            ),
            electric_windows: this.parseBooleanFromString(input['ele']),
            remote_trunk_opening: this.parseBooleanFromString(
              input['Apertura remota de baúl'],
            ),
            steering_wheel_radio_remote_control: this.parseBooleanFromString(
              input['Comando remoto para radio en el volante'],
            ),
            cup_holder: this.parseBooleanFromString(input['Porta vasos']),
            heating: this.parseBooleanFromString(input['Climatizador']),
            automatic_window_closing: this.parseBooleanFromString(
              input['Cierre automático de vidrios'],
            ),
          },
          entertainment: {
            am_fm: this.parseBooleanFromString(input['AM/FM']),
            auxiliar_input: this.parseBooleanFromString(
              input['Entrada auxiliar'],
            ),
            bluetooth: this.parseBooleanFromString(input['Bluetooth']),
            cd: this.parseBooleanFromString(input['CD']),
            dvd: this.parseBooleanFromString(input['DVD']),
            mp3_player: this.parseBooleanFromString(
              input['Reproductor de MP3'],
            ),
            usb_input: this.parseBooleanFromString(input['Entrada USB']),
          },
          exterior: {
            alloy_wheels: this.parseBooleanFromString(
              input['Llantas de aleación'],
            ),
            retractable_electric_sunroof: this.parseBooleanFromString(
              input['Techo solar eléctrico retráctil'],
            ),
            spare_tire_carrier: this.parseBooleanFromString(
              input['Soporte para rueda de auxilio'],
            ),
            clean_rear_window: this.parseBooleanFromString(
              input['Limpia/lava luneta'],
            ),
            roof_luggage_rack: this.parseBooleanFromString(
              input['Porta equipaje en techo'],
            ),
          },
          interior: {
            leather_upholstery: this.parseBooleanFromString(
              input['Tapizado de cuero'],
            ),
          },
          warranty_and_conditions: {
            factory_warranty: this.parseBooleanFromString(
              input['Con garantía de fábrica'],
            ),
            mechanical_warranty: this.parseBooleanFromString(
              input['Con garantía mecánica'],
            ),
            negotiable_price: this.parseBooleanFromString(
              input['Precio negociable'],
            ),
            accept_exchange: this.parseBooleanFromString(
              input['Acepta permuta'],
            ),
            home_delivery: this.parseBooleanFromString(
              input['Entrega a domicilio'],
            ),
            virtual_tours: this.parseBooleanFromString(
              input['Tours virtuales'],
            ),
            test_drive_at_home: this.parseBooleanFromString(
              input['Test drive a domicilio'],
            ),
          },
          performance: {
            power: this.parseNumberFromString(input['Potencia']),
            wheelbase: this.parseNumberFromString(
              input['Distancia entre ejes'],
            ),
            tank_capacity: this.parseNumberFromString(
              input['Capacidad del tanque'],
            ),
            valves_per_cylinder: this.parseNumberFromString(
              input['Válvulas por cilindro'],
            ),
            length_height_width: input['Largo x Altura x Ancho'],
          },
        },
      },
      link: {
        url: input['url'],
      },
    };
  }

  private parseNumber(value: any): number | null {
    if (value === undefined || value === null) {
      return null;
    }
    const parsed = Number(value);
    return isNaN(parsed) ? null : parsed;
  }

  private parseNumberFromString(value: string | undefined): number {
    if (!value) return 1;

    const cleaned = value.replace(/\./g, '');
    const numberMatch = cleaned.match(/\d+/);

    return numberMatch ? Number(numberMatch[0]) : 1;
  }

  private parseBooleanFromString(
    value: string | undefined,
  ): boolean | undefined {
    if (value !== undefined) {
      if (
        value === 'Sí' ||
        value === 'Sí' ||
        value === 'SI' ||
        value === 'Si'
      ) {
        return true;
      } else {
        return false;
      }
    } else {
      return value;
    }
  }

  private parseString(value: any): string | null {
    if (value === undefined || value === null) {
      return null;
    }
    return String(value);
  }
}
