import React, { Component } from 'react';
import values from 'lodash/values';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

const data = {
  '/root': {
    path: '/root',
    type: 'folder',
    isRoot: true,
    children: ['/root/david', '/root/jslancer'],
  },
  '/root/david': {
    path: '/root/david',
    type: 'folder',
    children: ['/root/david/readme.md'],
  },
  '/root/david/readme.md': {
    path: '/root/david/readme.md',
    type: 'file',
    content: 'Thanks for reading me me. But there is nothing here.'
  },
  '/root/jslancer': {
    path: '/root/jslancer',
    type: 'folder',
    children: ['/root/jslancer/projects', '/root/jslancer/vblogs'],
  },
  '/root/jslancer/projects': {
    path: '/root/jslancer/projects',
    type: 'folder',
    children: ['/root/jslancer/projects/treeview'],
  },
  '/root/jslancer/projects/treeview': {
    path: '/root/jslancer/projects/treeview',
    type: 'folder',
    children: [],
  },
  '/root/jslancer/vblogs': {
    path: '/root/jslancer/vblogs',
    type: 'folder',
    children: [],
  },
};

export default class Tree extends Component {

  state = {
    nodes: new Map(),
    isLoaded: false,
    items: []
  };

  componentDidMount() {
    fetch('https://ancient-beyond-47528.herokuapp.com/v1/category/categorylist', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTE3ZWJiZmMwZjdmMDAwNGQ0ZjY1ZCIsImlhdCI6MTYwNDM0NzU3Nn0.NehUTcsl3LFWlRaVmCmeY4BSyx8190ljwin9yhz2nY4`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        status: 1
      })
    }).then(res => res.json())
        .then((result) => {
          let map = new Map()
          result.data.forEach(e => {
            map.set(e.title, {
              ...e,
              isOpen: false,
              path: e.title,
              isRoot: true,
            })
            this.setState(() => {nodes: map})
          });
          this.setState({
            isLoaded: true,
            nodes: map
          })
        })
        .catch( e => console.log(e))
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    console.log(this.state.items)
  }

  getRootNodes = () => {
    const { nodes } = this.state;
    console.log(nodes)
    return values(nodes).filter(node => {
      console.log(node)
      return node.isRoot === true
    });
  }

  getChildNodes = (node) => {
    const { nodes } = this.state;
    if (!node.children) return [];
    return node.children.map(path => nodes[path]);
  }

  onToggle = (node, children) => {
    const { nodes } = this.state;
    nodes[node.path].isOpen = !node.isOpen;
    this.setState({ nodes });
  }

  onNodeSelect = node => {
    const { onSelect } = this.props;
    onSelect(node);
  }

  render() {
    const rootNodes = this.getRootNodes();
    console.log(rootNodes);
    return (
      <div>
        { rootNodes.map(node => (
          <TreeNode
            key = {node.path}
            node={node}
            getChildNodes={this.getChildNodes}
            onToggle={this.onToggle}
            onNodeSelect={this.onNodeSelect}
          />
        ))}
      </div>
    )
  }
}

Tree.propTypes = {
  onSelect: PropTypes.func.isRequired,
};