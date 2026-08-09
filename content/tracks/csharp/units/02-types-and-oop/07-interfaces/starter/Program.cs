// 1. Print the header line:  Wake-up service:
// 2. Build a List<IAlarm> with one Rooster, one Phone, one Neighbor,
//    and foreach over it calling Ring(). Expected output:
//      Wake-up service:
//      Cock-a-doodle-doo!
//      Beep beep beep!
//      Vrrrrrm. Vrrrrrm.

// Declare the contract below:
//   interface IAlarm { void Ring(); }

// Then three classes that sign it (note: no shared base class!):
//   Rooster : IAlarm  -> prints Cock-a-doodle-doo!
//   Phone   : IAlarm  -> prints Beep beep beep!
//   Neighbor: IAlarm  -> prints Vrrrrrm. Vrrrrrm.
