// THIS IS AN AUTOGENERATED FILE. DO NOT EDIT THIS FILE DIRECTLY.

import {
  TypedMap,
  Entity,
  Value,
  ValueKind,
  store,
  Bytes,
  BigInt,
  BigDecimal
} from "@graphprotocol/graph-ts";

export class Proposal extends Entity {
  constructor(id: string) {
    super();
    this.set("id", Value.fromString(id));
  }

  save(): void {
    let id = this.get("id");
    assert(id != null, "Cannot save Proposal entity without an ID");
    if (id) {
      assert(
        id.kind == ValueKind.STRING,
        `Entities of type Proposal must have an ID of type String but the id '${id.displayData()}' is of type ${id.displayKind()}`
      );
      store.set("Proposal", id.toString(), this);
    }
  }

  static loadInBlock(id: string): Proposal | null {
    return changetype<Proposal | null>(store.get_in_block("Proposal", id));
  }

  static load(id: string): Proposal | null {
    return changetype<Proposal | null>(store.get("Proposal", id));
  }

  get id(): string {
    let value = this.get("id");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toString();
    }
  }

  set id(value: string) {
    this.set("id", Value.fromString(value));
  }

  get proposalId(): BigInt {
    let value = this.get("proposalId");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBigInt();
    }
  }

  set proposalId(value: BigInt) {
    this.set("proposalId", Value.fromBigInt(value));
  }

  get proposer(): Bytes {
    let value = this.get("proposer");
    if (!value || value.kind == ValueKind.NULL) {
      throw new Error("Cannot return null for a required field.");
    } else {
      return value.toBytes();
    }
  }

  set proposer(value: Bytes) {
    this.set("proposer", Value.fromBytes(value));
  }

  get targetContracts(): Array<Bytes> | null {
    let value = this.get("targetContracts");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytesArray();
    }
  }

  set targetContracts(value: Array<Bytes> | null) {
    if (!value) {
      this.unset("targetContracts");
    } else {
      this.set("targetContracts", Value.fromBytesArray(<Array<Bytes>>value));
    }
  }

  get values(): Array<BigInt> | null {
    let value = this.get("values");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigIntArray();
    }
  }

  set values(value: Array<BigInt> | null) {
    if (!value) {
      this.unset("values");
    } else {
      this.set("values", Value.fromBigIntArray(<Array<BigInt>>value));
    }
  }

  get targetsLength(): Array<string> | null {
    let value = this.get("targetsLength");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toStringArray();
    }
  }

  set targetsLength(value: Array<string> | null) {
    if (!value) {
      this.unset("targetsLength");
    } else {
      this.set("targetsLength", Value.fromStringArray(<Array<string>>value));
    }
  }

  get calldatas(): Array<Bytes> | null {
    let value = this.get("calldatas");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBytesArray();
    }
  }

  set calldatas(value: Array<Bytes> | null) {
    if (!value) {
      this.unset("calldatas");
    } else {
      this.set("calldatas", Value.fromBytesArray(<Array<Bytes>>value));
    }
  }

  get startBlock(): BigInt | null {
    let value = this.get("startBlock");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set startBlock(value: BigInt | null) {
    if (!value) {
      this.unset("startBlock");
    } else {
      this.set("startBlock", Value.fromBigInt(<BigInt>value));
    }
  }

  get endBlock(): BigInt | null {
    let value = this.get("endBlock");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toBigInt();
    }
  }

  set endBlock(value: BigInt | null) {
    if (!value) {
      this.unset("endBlock");
    } else {
      this.set("endBlock", Value.fromBigInt(<BigInt>value));
    }
  }

  get title(): string | null {
    let value = this.get("title");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set title(value: string | null) {
    if (!value) {
      this.unset("title");
    } else {
      this.set("title", Value.fromString(<string>value));
    }
  }

  get description(): string | null {
    let value = this.get("description");
    if (!value || value.kind == ValueKind.NULL) {
      return null;
    } else {
      return value.toString();
    }
  }

  set description(value: string | null) {
    if (!value) {
      this.unset("description");
    } else {
      this.set("description", Value.fromString(<string>value));
    }
  }
}
