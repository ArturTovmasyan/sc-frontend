interface IdInterface {
  id: number;
}

function instanceOfIdInterface(object: any): object is IdInterface {
  return 'id' in object;
}
