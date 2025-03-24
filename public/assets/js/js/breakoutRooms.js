class BreakoutRooms {
    constructor() {
        this.rooms = new Map();
    }

    createRoom(name, capacity) {
        const room = {
            id: Date.now(),
            name,
            capacity,
            participants: new Set(),
            stream: null
        };
        this.rooms.set(room.id, room);
        return room.id;
    }

    joinRoom(roomId, participant) {
        const room = this.rooms.get(roomId);
        if (room && room.participants.size < room.capacity) {
            room.participants.add(participant);
            return true;
        }
        return false;
    }
} 