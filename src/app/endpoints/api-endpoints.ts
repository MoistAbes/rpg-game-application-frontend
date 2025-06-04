export const API_ENDPOINTS = {
  BASE_URL: "http://localhost:8080/",

  AUTH_SERVICE: {
    LOGIN: "auth/login",  // change this from a function to a string
    SELECT_CHARACTER: "auth/select-character/"  // change this from a function to a string
  },
  USER_SERVICE: {
    REGISTER: "users/register",
    GET_ALL_USERS: "users/get-all",
  },
  CHARACTER_SERVICE: {
    GET_ALL_BY_USER: "characters/get-all-by-user/",
    GET_CHARACTER: "characters/get-character/",
    CREATE_CHARACTER: "characters/create/",
    GET_CHARACTER_STATS: "characters/stats/get-by-character-id/",
    UPDATE_CHARACTER_CURRENT_HEALTH: "characters/stats/current-health/",
  },
  INVENTORY_SERVICE: {
    GET_INVENTORY: "inventory-service/inventories/get-inventory/",
    MOVE_ITEM: "inventory-service/inventories/move-item/",
    GET_EQUIPMENTS: "inventory-service/equipments/get-equipment/",
    UNEQUIP_ITEM_TO_EMPTY_SLOT: "inventory-service/equipments/unequip-item-to-empty-slot/",
    UNEQUIP_ITEM_TO_TAKEN_SLOT: "inventory-service/equipments/unequip-item-to-taken-slot/",
    EQUIP_ITEM_TO_EMPTY_SLOT: "inventory-service/equipments/equip-item-to-empty-slot/",
    EQUIP_ITEM_TO_TAKEN_SLOT: "inventory-service/equipments/equip-item-to-taken-slot/",
    DELETE_ITEM: "inventory-service/inventories/delete-item/",
    GET_ALL_ITEM_INSTANCE_BY_IDS: "inventory-service/item-instance/get-all-instance-by-ids",
  },
  ZONE_SERVICE: {
    GET_ZONES: "zone-service/zones/get-all",
    GET_TIME_CYCLE: "zone-service/time-cycle",
    CREATE_LOCATION_INSTANCE: "zone-service/location-instance/create/",
    GET_LOCATION_INSTANCE_BY_CHARACTER_ID: 'zone-service/location-instance/character/',
    DELETE_LOCATION_INSTANCE: 'zone-service/location-instance/delete/'
  },
  ENEMY_SERVICE: {
    GENERATE_ENEMY: "enemy-service/enemy-instance/generate-enemy-instance",
    GET_ENEMY_TEMPLATE_BY_TYPE_AND_RANK: "enemy-service/enemy-template/get-all/type/tier",
    ENEMY_TYPE_GET_ALL: 'enemy-service/enemy-type/get-all',
  },
  COMBAT_SERVICE: {
    START_COMBAT: "combat-service/combat/start"
  }
};
