export function getPbImageURL(item, fileName = 'photo') {
  return `${import.meta.env.VITE_PB_API}/files/${item.collectionId}/${
    item.id
  }/${item[fileName]}`;
}

export function getPbImagesURL(item, fileName = 'photo') {
  const fileArr = item[fileName].map(
    (fileName) =>
      `${import.meta.env.VITE_PB_API}/files/${item.collectionId}/${
        item.id
      }/${fileName}`
  );
  return fileArr;
}
