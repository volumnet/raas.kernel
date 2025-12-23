/**
 * Форматирует папку
 * @param {Object} folderData Данные записи
 * @param {Object} oldFolderData Старые данные записи
 */
export function formatFolder(folderData, oldFolderData = {}) {
  const folderDataWithoutChildren = { ...folderData };
  delete folderDataWithoutChildren.children;

  const oldFolderDataWithoutChildren = { ...oldFolderData };
  delete oldFolderDataWithoutChildren.children;

  const newFolderData = {
    ...oldFolderDataWithoutChildren,
    ...folderDataWithoutChildren,
  };

  if (folderData?.children) {
    newFolderData.children = [];
    const childFolders = folderData.children.filter(
      (child) => child.type == "dir"
    );
    for (const child of childFolders) {
      const oldChild = (oldFolderData?.children || []).find(
        (och) => och.name == child.name && och.type == "dir"
      );
      const newChild = formatFolder(child, oldChild || {});
      newFolderData.children.push(newChild);
    }
  } else if (oldFolderData?.children) {
    // У новой записи нет дочерних
    newFolderData.children = oldFolderData.children;
  } else {
    newFolderData.children = null;
  }
  return newFolderData;
}

/**
 * Ищет папку в дереве папок
 * @param {object[]} foldersGraph Дерево папок
 * @param {string} path Путь к папке
 * @return {object|null} Обновленное дерево папок
 */
export function findFolder(foldersGraph, path) {
  const pathArr = path.trim().split("/");
  const childIndex = foldersGraph.findIndex((x) => x.name == pathArr[0]);
  if (childIndex < 0) {
    return null;
  }
  const child = foldersGraph[childIndex];
  if (pathArr.length > 1) {
    return findFolder(child?.children || [], pathArr.slice(1).join("/"));
  } else {
    return child;
  }
}

/**
 * Заменяет папку в дереве папок
 * @param {object[]} foldersGraph Дерево папок
 * @param {string} path Путь к заменяемой папке
 * @param {object} newFolder Объект обновленной папки
 * @return {object[]} Обновленное дерево папок
 */
export function replaceFolder(foldersGraph, path, newFolder) {
  const pathArr = path.trim().split("/");
  const childIndex = foldersGraph.findIndex((x) => x.name == pathArr[0]);
  if (childIndex < 0) {
    return foldersGraph;
  }
  const child = foldersGraph[childIndex];
  const result = [...foldersGraph];
  if (pathArr.length > 1) {
    if (!child?.children?.length) {
      return foldersGraph;
    }
    const newGrandChildren = replaceFolder(
      child.children,
      pathArr.slice(1).join("/"),
      newFolder
    );
    const newChild = { ...child, children: newGrandChildren };
    result[childIndex] = newChild;
  } else {
    result[childIndex] = newFolder;
  }
  return result;
}
