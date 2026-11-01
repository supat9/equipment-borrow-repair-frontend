const mockBuildings = {
  buildings: [
    {
      building_id: 1,
      building_code: "Q05",
      building_name: "SC-11",
      description: "อาคาร IT",
      is_active: true,
      floors: [
        {
          floor_id: 101,
          floor_number: 1,
          floor_name: "ชั้น 1",
          description: "ชั้นสำหรับห้องเรียนทั่วไป",
          is_active: false,
          rooms: [
            {
              room_id: 1001,
              room_number: "101",
              room_name: "ห้องเรียน A",
              room_type_id: 1,
              room_type: "ห้องเลคเชอร์",
              capacity: 40,
              purpose: "เรียนโปรแกรมพื้นฐาน",
              is_active: true
            },
            {
              room_id: 1002,
              room_number: "102",
              room_name: "ห้องเรียน B",
              room_type_id: 1,
              room_type: "ห้องเลคเชอร์",
              capacity: 35,
              purpose: "",
              is_active: false
            }
          ]
        },
        {
          floor_id: 102,
          floor_number: 2,
          floor_name: "ชั้น 2",
          description: "ชั้นสำหรับห้องแลป",
          is_active: true,
          rooms: [
            {
              room_id: 1003,
              room_number: "201",
              room_name: "แลปคอมพิวเตอร์",
              room_type_id: 2,
              room_type: "ห้องแลป",
              capacity: 25,
              purpose: "ปฏิบัติการเขียนโปรแกรม",
              is_active: true
            }
          ]
        }
      ]
    },
    {
      building_id: 2,
      building_code: "Q09",
      building_name: "SC-9",
      description: "ใช้สำหรับห้องแลปวิทย์",
      is_active: false,
      floors: [] // ยังไม่มีชั้น
    }
  ]
};

const mockRoomTypes = {
  room_types: [
    {
      room_type_id: 1,
      room_type_name: "ห้องเลคเชอร์",
      description: "ห้องสำหรับการบรรยายและการเรียนการสอนทั่วไป",
      is_active: true
    },
    {
      room_type_id: 2,
      room_type_name: "ห้องแลป",
      description: "ห้องปฏิบัติการสำหรับการทดลองและฝึกปฏิบัติ",
      is_active: false
    },
    {
      room_type_id: 3,
      room_type_name: "ห้องประชุม",
      description: "ห้องสำหรับการประชุมและการสัมมนา",
      is_active: true
    }
  ]
};

export { mockRoomTypes };
export default mockBuildings;
