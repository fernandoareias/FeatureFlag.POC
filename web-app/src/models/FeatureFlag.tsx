

export class FeatureFlag {
    tableName: string;
    active: boolean;
    aliasName: string; 
 
    constructor(
      tableName: string,
        active:  boolean,
        aliasName: string
      ) {
        this.tableName = tableName;
        this.active = active;
        this.aliasName = aliasName;
      }
}