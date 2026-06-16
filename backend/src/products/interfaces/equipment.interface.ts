export interface IEquipment {
  other_features?: {
    autopilot?: boolean;
    lights_on_alarm?: boolean;
    on_board_computer?: boolean;
    battery_type?: string;
    battery_capacity?: number;
    charging_time?: number;
    charger_type?: string;
    battery_life?: number;
  };
  security?: {
    abs_brakes?: boolean;
    alarm?: boolean;
    front_bumper?: boolean;
    driver_airbag?: boolean;
    headlights_with_automatic_leveling?: boolean;
    parking_sensor?: boolean;
    airbag_for_driver_and_passenger?: boolean;
    rain_sensor?: boolean;
    rear_fog_lights?: boolean;
    rear_defroster?: boolean;
    stability_control?: boolean;
    third_led_brake_light?: boolean;
    central_door_locking?: boolean;
    backup_camera?: boolean;
    armored?: boolean;
  };
  confort?: {
    air_conditioner?: boolean;
    electric_windows?: boolean;
    remote_trunk_opening?: boolean;
    steering_wheel_radio_remote_control?: boolean;
    cup_holder?: boolean;
    heating?: boolean;
    automatic_window_closing?: boolean;
  };
  entertainment?: {
    am_fm?: boolean;
    auxiliar_input?: boolean;
    bluetooth?: boolean;
    cd?: boolean;
    dvd?: boolean;
    mp3_player?: boolean;
    usb_input?: boolean;
  };
  exterior?: {
    alloy_wheels?: boolean;
    retractable_electric_sunroof?: boolean;
    spare_tire_carrier?: boolean;
    clean_rear_window?: boolean;
    roof_luggage_rack?: boolean;
  };
  interior?: {
    leather_upholstery?: boolean;
  };
  warranty_and_conditions?: {
    factory_warranty?: boolean;
    mechanical_warranty?: boolean;
    negotiable_price?: boolean;
    accept_exchange?: boolean;
    home_delivery?: boolean;
    virtual_tours?: boolean;
    test_drive_at_home?: boolean;
  };
  performance: {
    tank_capacity?: number;
    power?: number;
    wheelbase?: number;
    valves_per_cylinder?: number;
    length_height_width?: string;
  };
}
