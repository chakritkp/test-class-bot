
class Bot {
  x: number
  y: number
  directions: string[]
  currentDirection: string
  //ตั้งค่าตัวแปลเริ่มต้น เนื่องจากเป็นการเดินแบบ 2 มิติทำให้มีแค่แกน x,y เพิ่มทิศทางตามเข็มนาฬิกา และตั้งค่าเริ่มต้นไปที่ทางเหนือเสมอ
  constructor() {
    this.x = 0;
    this.y = 0;
    this.directions = ["North", "East", "South", "West"];
    this.currentDirection = "North";
  }
  //กำหนดทิศในการเดินเก็บใน currentDirection เพื่อจะได้รู้ว่าต้อง + หรือ - แกน x หรือ y
  turnRight() {
    // เช็คว่าปัจจุบันหันไปในทิศทางไหนแล้วแสดงออกมาเป็นตำแหน่ง index ใน array
    // เพื่อจะได้รู้ว่า index ตำแหน่งถัดไปจะเป็นทิศไหน และเนื่องจากเรากำหนดให้ทิศเรียงวนตามเข็มนาฬิกาแล้วทำให้ทราบได้ว่าจะหันไปในทิศที่ถูกต้อง
    const indexCurDirection = this.directions.indexOf(this.currentDirection);
    // เนื่องจากเป็นการหันไปทางขวาทำให้ต้องบวก index อีก 1 เพื่อไปในทิศถัดไปตามเข็มนาฬิกา
    // และหาเศษจากค่าที่ได้กับความยาวของ array เพื่อไม่ให้เกินความยาวของ array
    const turnToDiretion =
      this.directions[(indexCurDirection + 1) % this.directions.length];
    // เก็บทิศปัจจุบันไว้เพื่อในการหันครั้งถัดไป
    this.currentDirection = turnToDiretion;
  }

  turnLeft() {
    // เช็คว่าปัจจุบันหันไปในทิศทางไหนแล้วแสดงออกมาเป็นตำแหน่ง index ใน array
    // เพื่อจะได้รู้ว่า index ตำแหน่งถัดไปจะเป็นทิศไหน และเนื่องจากเรากำหนดให้ทิศเรียงวนตามเข็มนาฬิกาแล้วทำให้ทราบได้ว่าจะหันไปในทิศที่ถูกต้อง
    const indexCurDirection = this.directions.indexOf(this.currentDirection);
    // เนื่องจากเป็นการหันไปทางซ้ายทำให้ต้องลบ index อีก 1 เพื่อไปในทิศถัดไปแบบทวนเข็มนาฬิกา
    // แต่ต้อง + ด้วยความยาวของ array ป็นการหลีกเลี่ยง index ติดลบ
    const turnToDiretion =
      this.directions[
      (indexCurDirection - 1 + this.directions.length) %
      this.directions.length
      ];
    //เก็บทิศปัจจุบันไว้เพื่อในการหันครั้งถัดไป
    this.currentDirection = turnToDiretion;
  }

  // รับค่าการเดินเข้ามาเพื่อมา + - ตำแหน่งของ x, y
  walking(distance: number): void {
    // รับตำแหน่งปัจจุบันมาเพื่อเช็คว่าต้อง + - แกนไหน
    //           North
    //             y
    //            ↑
    //            |
    // West    ←─────→ x East
    //            |
    //            ↓
    //           South
    switch (this.currentDirection) {
      // กรณีที่เป็นเหนือจะ + เพิ่มตามแกน y
      case "North":
        this.y += distance;
        break;
      // กรณีที่เป็นเหนือจะ + เพิ่มตามแกน x
      case "East":
        this.x += distance;
        break;
      // กรณีที่เป็นเหนือจะ - เพิ่มตามแกน y
      case "South":
        this.y -= distance;
        break;
      // กรณีที่เป็นเหนือจะ - เพิ่มตามแกน x
      case "West":
        this.x -= distance;
        break;
    }
  }

  // ควบคุมการเดินโดยรับคำสั่งในรูปแบบ string
  controller(stringCommand: string): string {
    // ทำ regex เพื่อเป็นแม่แบบในการแยก string ของการหันกับการเดิน ชุดแรกจะเป็น R หรือ L เพื่อหัน ชุดที่สองจะจับตัวเลขหลัง W เพื่อบอกจำนวนในการเดิน
    const regex = /([RL])|W(\d+)/g;
    // ประกาศตัวแปรว่างเพื่อรับ [] ของ คำสั่ง
    let command: Array<string> | null;

    // ทำการ loop ทำการวนลูปจนกว่าจะไม่พบการจับคู่ที่ตรงกับ regex
    while ((command = regex.exec(stringCommand))) {
      // สร้าง object เพื่อเก็บค่าที่ได้จาก command ถ้าเป็น R หรือ L จะอยู่ในชุดที่ 1 ที่หมายถึงการหัน ถ้าเป็น W ตามด้วยตัวเลข จะเก็บค่าการเดิน
      const control = {
        turn: command[1],
        walk: command[2],
      };

      // ถ้าไม่มีการหันก็ให้ทำการเดินได้เลย
      if (!control.turn) {
        this.walking(parseInt(control.walk, 10));
      } else {
        // ถ้ามีการหันให้เช็คว่าหันไปทางไหนและใช้ function หันตามที่กำหนด
        if (control.turn === "R") {
          this.turnRight();
        } else if (control.turn === "L") {
          this.turnLeft();
        }
      }
    }
    // แสดงตำแหน่งปัจจุบันและทิศทางที่หันไป
    return `X: ${this.x} Y: ${this.y} Direction: ${this.currentDirection}`;
  }
}

const botExample = new Bot();
const botCase1 = new Bot();
const botCase2 = new Bot();
const botCase3 = new Bot();
const botCase4 = new Bot();
const botCase5 = new Bot();

console.log("Example:", botExample.controller("RW15RW1"));
console.log("Case 1:", botCase1.controller("W5RW5RW2RW1R"));
console.log("Case 2:", botCase2.controller("RRW11RLLW19RRW12LW1"));
console.log("Case 3:", botCase3.controller("LLW100W50RW200W10"));
console.log("Case 4:", botCase4.controller("LLLLLW99RRRRRW88LLLRL"));
console.log("Case 5:", botCase5.controller("W55555RW555555W444444W1"));
