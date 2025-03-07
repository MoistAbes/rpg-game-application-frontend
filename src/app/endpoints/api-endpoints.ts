export const API_ENDPOINTS = {
  BASE_URL: "http://localhost:8080/",

  AUTH_SERVICE: {
    LOGIN: "auth/login"  // change this from a function to a string
  },
  CHARACTER_SERVICE: {
    GET_ALL_BY_USER: "characters/get-all-by-user/",
    GET_CHARACTER: "characters/get-character/",
    GET_CHARACTER_STATS: "characters/stats/get-by-character-id/",
  },
  INVENTORY_SERVICE: {
    GET_INVENTORY: "inventory-service/inventories/get-inventory/",
    MOVE_ITEM: "inventory-service/inventories/move-item/",
    GET_EQUIPMENTS: "inventory-service/equipments/get-equipment/",
    UNEQUIP_ITEM_TO_EMPTY_SLOT: "inventory-service/equipments/unequip-item-to-empty-slot/",
    UNEQUIP_ITEM_TO_TAKEN_SLOT: "inventory-service/equipments/unequip-item-to-taken-slot/",
    EQUIP_ITEM_TO_EMPTY_SLOT: "inventory-service/equipments/equip-item-to-empty-slot/",
    EQUIP_ITEM_TO_TAKEN_SLOT: "inventory-service/equipments/equip-item-to-taken-slot/",
  },
};
