/*
 * @Author: bhz
 * @Date: 2020-10-22 11:28:20
 * @Last Modified by: bhz
 * @Last Modified time: 2020-10-23 16:14:05
 */

// 机构类型
export const ENUM_TYPE = {
  1: '内部系统',
  2: '外部公司',
};

// 生成二维码的入参link
export const LINK =
  'http://htmosdev.data4truth.com:8080/wechatplatform-server/pages/index/index';

/**
 * @param {*} tree any []
 * @param {*} options {labelKey? valueKey?}
 * @return newTree
 */

export function transformTree(
  tree,
  options = { labelKey: 'title', valueKey: 'orgId' }
) {
  function trans(tree, newTree = []) {
    for (let i = 0; i < tree.length; i++) {
      newTree.push({
        ...tree[i],
        label: tree[i][options.labelKey],
        value: tree[i][options.valueKey],
        children: [],
      });
      if (tree[i].children) {
        trans(tree[i].children, newTree[i].children);
      }
    }
    return newTree;
  }
  return trans(tree);
}
