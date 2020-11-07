import React from 'react';
import { FaFile, FaFolder, FaFolderOpen, FaChevronDown, FaChevronRight } from 'react-icons/fa';
import styled from 'styled-components';
import PropTypes from 'prop-types';

const getPaddingLeft = (level, type) => {
  let paddingLeft = level * 20;
  if (type === 'file') paddingLeft += 20;
  return paddingLeft;
}

const StyledTreeNode = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  padding: 5px 8px;
  padding-left: ${props => getPaddingLeft(props.level, props.type)}px;

  &:hover {
    background: lightgray;
  }
`;

const NodeIcon = styled.div`
  font-size: 12px;
  margin-right: ${props => props.marginRight ? props.marginRight : 5}px;
`;


const TreeNode = (props) => {
  const { node, getChildNodes, level, onToggle, onNodeSelect } = props;
  const [child, setChild] = React.useState({});

  const Node = async (node) => {
    console.log(node._id);
    await fetch('https://ancient-beyond-47528.herokuapp.com/v1/category/getCategoryTreeById', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVmOTE3ZWJiZmMwZjdmMDAwNGQ0ZjY1ZCIsImlhdCI6MTYwNDM0NzU3Nn0.NehUTcsl3LFWlRaVmCmeY4BSyx8190ljwin9yhz2nY4`,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        status: 1,
        searchid: node._id
      })
    }).then(res => res.json()  
        .then((result) => {
          console.log(result, level)
          let childObj = {}
          let i = ''
          let childPath = []

          result.data.forEach(e => {
            childPath.push(node.path+"/"+e.title)
            i = node.path+"/"+e.title
            childObj[i] = {
              ...e,
              isOpen: false,
              path: node.path+"/"+e.title,
              children: []
            }
          console.log(childObj)
          })

        setChild(childObj)
        onToggle(node,childPath, childObj)

  }))
}

  React.useEffect(() => console.log(child))

  return (
    <React.Fragment>
      <StyledTreeNode level={level} type={node.type}>
        <NodeIcon onClick={async () => {
          console.log("toggle")
          await Node(node)
        }}>
          { node.haveChild && (node.isOpen ? <FaChevronDown /> : <FaChevronRight />) }
        </NodeIcon>
        
        <NodeIcon marginRight={10}>
          { !node.haveChild && <FaFile /> }
          { node.haveChild && node.isOpen === true && <FaFolderOpen /> }
          { node.haveChild  && !node.isOpen && <FaFolder /> }
        </NodeIcon>
        

        <span role="button" onClick={() =>
        {
          console.log("node select")
          onNodeSelect(node)
        }}>
          {
            node.title.toLowerCase()
            // getNodeLabel(node)
          }
        </span>
      </StyledTreeNode>

      { node.isOpen && getChildNodes(node).map(childNode => (
        <TreeNode 
          {...props}
          node={childNode}          
          level={level + 1}
        />
      ))}
    </React.Fragment>
  );
}

TreeNode.propTypes = {
  node: PropTypes.object.isRequired,
  getChildNodes: PropTypes.func.isRequired,
  level: PropTypes.number.isRequired,
  onToggle: PropTypes.func.isRequired,
  onNodeSelect: PropTypes.func.isRequired,
};

TreeNode.defaultProps = {
  level: 0,
};

export default TreeNode;
