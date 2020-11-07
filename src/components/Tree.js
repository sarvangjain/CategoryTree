import React, { Component } from 'react';
import values from 'lodash/values';
import PropTypes from 'prop-types';

import TreeNode from './TreeNode';

export default class Tree extends Component {

  state = {
    nodes: {},
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
          let obj = {}
          let i = ''
          result.data.forEach(e => {
            i = '/'+e.title
            obj[i] = {
              ...e,
              isOpen: false,
              path: '/' + e.title,
              isRoot: true,
              children: []
            }
            i+=1
          });
          this.setState({
            isLoaded: true,
            nodes: obj
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
      return node.isRoot === true
    });
  }

  getChildNodes = (node) => {
    const { nodes } = this.state;
    console.log(node, node.children)
    if (!node.children) return [];
    if (node.children.length === 0) return [];
    return node.children.map(path => nodes[path]);
  }

  onToggle = (node, children, child) => {
    console.log(children)
    const { nodes } = this.state;
    nodes[node.path].isOpen = !node.isOpen;
    let newNode = {}
    if (nodes[node.path].children.length === 0) {
      newNode = {...nodes, ...child}
      nodes[node.path].children = children
    }
    else {
      newNode = nodes
    }
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx',newNode)
    this.setState({ nodes: newNode });
    
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