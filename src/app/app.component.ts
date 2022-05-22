import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  rows = Math.round(((window.outerHeight-270)/31));
  cols = Math.round(((window.outerWidth-50)/31));
  gridData: any[] = new Array(this.rows);
  clicked = false;
  selectedCnt = 0;
  animateResult: any[] = [];
  index = 0;
  animateInterval: any;
  unsetGrid: any[];
  bestRoute: Node[];
  parentMap: Map<string, Node[]>;
  wall: boolean = true;
  currentNodes: Node[] = [];
  bestresult: any;
  animateInterval2: any;
  algo: any ;
  options = ['Breadth First Search', 'Depth First Search', 'Best First Search', 'A* Search', 'Dijkstra', 'Jump Point Search']
  mazeoptions = ['Recurcise Division', 'Horizontal Skewed Recurcise Division', 'Vertical Skewed Recurcise Division','Recursive Backtrack','Basic Random','Random Weight']

  weight = false;
  nodesToAnimate: Node[] = [];
  selectedRDOrientation ;
  selectedFlag = false;
  lastVisited: Node;
  selectedNode: boolean;
  movedFlag = false;
  hasAnimated = false;
  wallAnimation=true;
  treshold=127;
  videoFlag: boolean;
  mazeFlag:boolean;
  imageFlag=false;
  cameraFlag=false;
  animationSpeed=30;
  algoDesc="Pick A Algorithm!";
  algoToDescMap=new Map<string,string>();
  ngOnInit(): void {
    this.algoToDescMap.set('Jump Point Search'," is an unweighed algorithm,which is an optimization to the A* search");
    this.algoToDescMap.set('A* Search'," is weighted and guarantees the shortest path!");
    this.algoToDescMap.set('Best First Search'," is weighted and does not guarantee the shortest path!");
    this.algoToDescMap.set('Depth First Search'," is unweighted and does not guarantee the shortest path!");
    this.algoToDescMap.set('Breadth First Search'," is unweighted and guarantees the shortest path!");
    this.algoToDescMap.set('Dijkstra'," is weighted and guarantees the shortest path!");
    this.generateGrid();
  }
  generateGrid() {
    for (let i = 0; i < this.rows; i++) {
      const colsData: Node[] = [];
      for (let j = 0; j < this.cols; j++) {
        let row = Math.floor((this.rows - 1) / 2);
        let col1 = Math.floor((this.cols - 1) * 0.25);
        let col2 = Math.floor((this.cols - 1) * 0.75);
        if (row == i && (col1 == j || col2 == j))
        {
          if(col1==j)
          colsData.push({ name: 'a' + i + ',' + j, selected: true, rowNo: i, colNo: j, dist: 0,startNodeFlag:true });
          else
          colsData.push({ name: 'a' + i + ',' + j, selected: true, rowNo: i, colNo: j, dist: 0,endNodeFlag:true });
        }
          
        else
          colsData.push({ name: 'a' + i + ',' + j, selected: false, rowNo: i, colNo: j, dist: 0 });
      }
      this.gridData[i] = colsData;
    }
    this.unsetGrid = _.cloneDeep(this.gridData);
  }
  setWallField() {
    this.wall = !this.wall;
    if (this.wall) {
      // this.Compute(this.gridData,0,0,this.rows,this.cols);
      // this.nodesToAnimate=[];
      // this.animateResult=this.recursiveDivisionMaze();
      // console.log(this.animateResult);
      // this.index=0;
      // this.animateInterval = setInterval(()=>{
      //   this.animateWalls()}, 20);

    }

    // else
    // this.clear();
    // this.wall=!this.wall;
  }
  setWeightField() {
    this.randomWeight(this.gridData);
  }
  onSelectClicked(obj: Node) {
    // if(this.wall){
    //   obj.wall=true;
    //   return;
    // }
    // if(this.weight){
    //   obj.weight=50;
    //   return;
    // }
    // if(this.selectedCnt>1 &&!obj.selected)
    // return;
    // else if(obj.selected){
    //   this.selectedCnt--;
    //   obj.selected=false;
    //   return;
    // }
    // if(this.clicked===true)
    // this.clicked=false;
    // else
    // this.clicked=true;
    // console.log("sdsd");

    // console.log(this.clicked);
    //
    // console.log("fgg")
    // if(this.clicked===false)return;
    // console.log("fg")
    // obj.selected=true;
    // this.selectedCnt++;
    // if(this.selectedCnt>1){

    // }
  }
  start() {
    this.animateResult = this.search(_.cloneDeep(this.gridData));
    this.index = 0;
    console.log(this.animateResult);
    if (this.animateResult !== undefined) {
      this.animateInterval = setInterval(() => {
        this.animateGrid()
      }, this.animationSpeed);
    }
  }
  startMaze() {
    this.nodesToAnimate = [];
    
    switch(this.selectedRDOrientation){
      case 'Recurcise Division':
        this.animateResult = this.recursiveDivisionMaze();
        break;
      case 'Horizontal Skewed Recurcise Division':
        this.animateResult = this.recursiveDivisionMaze();
      break;
      case 'Vertical Skewed Recurcise Division':
        this.animateResult = this.recursiveDivisionMaze();
      break;
      case 'Basic Random':
      this.animateResult = this.randomMaze();
      break;
      case 'Random Weight':
      this.animateResult=this.randomWeight(this.gridData);
      break;
      case 'Recursive Backtrack':
        this.animateResult = this.recursiveBack(this.gridData);
      break;
      case 'Generate Maze With Camera':
        this.mazeFlag=true;
        this.cameraFlag=true;
        break;
      case 'Generate Weight With Camera':
        this.mazeFlag=false;
        this.cameraFlag=true;
        break;
      case 'Generate Weight With Image':
        this.imageFlag=true;
        break;
    }
    // this.hasAnimated=false;
    if(this.selectedRDOrientation!=='Generate Maze With Camera'&&this.selectedRDOrientation!=='Generate Weight With Camera')
    {console.log(this.animateResult);
    this.index = 0;
    this.animateInterval = setInterval(() => {
      this.animateWallAndWeight()
    }, 20);}
    else{
      this.video();
    }
  }
  animateGrid() {
    if (this.index >= this.animateResult.length - 1) {
      setTimeout(() => { this.callBestRouteAnimation() }, 500);
      clearInterval(this.animateInterval);
      return;
    }
    this.gridData[this.animateResult[this.index].rowNo][this.animateResult[this.index].colNo].status = this.animateResult[this.index].status;
    //  n:Node={};
    this.index++;
  }
  animateWallsAndWeightSeparate(){
    this.animateResult=this.nodesToAnimate;
    this.index=0;
    this.animateInterval = setInterval(() => {
      this.animateWallAndWeight()
    }, 20);
  }
  callBestRouteAnimation() {
    this.animateResult = _.cloneDeep(this.bestresult);
    this.index = 1;
    this.animateInterval2 = setInterval(() => {
      this.animateBestRoute()
    }, 40);
  }
  animateBestRoute() {

    if (this.index >= this.animateResult.length-1) {
      clearInterval(this.animateInterval2);
      this.hasAnimated = true;
      return;
    }
    this.gridData[this.bestresult[this.index].rowNo][this.bestresult[this.index].colNo].optimalNode = this.bestresult[this.index].optimalNode;
    this.index++;
  }
  animateWallAndWeight() {

    if (this.index >= this.animateResult.length) {
      clearInterval(this.animateInterval);
      // this.wallAnimation=true;
      return;
    }
    if(this.animateResult[this.index].weightStatus!==undefined){
      this.gridData[this.animateResult[this.index].rowNo][this.animateResult[this.index].colNo].weightStatus =this.animateResult[this.index].weightStatus;
    }
    else{
      this.gridData[this.animateResult[this.index].rowNo][this.animateResult[this.index].colNo].status=this.animateResult[this.index].status;
    }
    this.index++;
  }
  search(data: any[]) {
    console.log("dfdf");
    const result: any[] = [];
    let startNode: Node = { name: 'empty', colNo: 0, rowNo: 0, selected: true, dist: 0 };
    let endNode: Node = { name: 'empty', colNo: 0, rowNo: 0, selected: true, dist: 0 };
    this.nodesToAnimate = [];
    // setting startNode and endNode
    // startNode = endNode;
    data.forEach(x => {
      const row: Node[] = x;
      row.forEach(y => {
        if (y.selected &&y.endNodeFlag===true) {
          endNode = y;
        }
        else if (y.selected &&y.startNodeFlag===true) {
          startNode = y;
        }
      })
    });
    // this.dfs(data,startNode,endNode,result);
    this.parentMap = new Map<string, Node[]>();
    this.parentMap.set(startNode.name, []);
    this.bestRoute = []
    // debugger;
    switch (this.algo) {
      case 'Breadth First Search':
        this.bfs(data, startNode, endNode, result);
        break;
      case 'Depth First Search':
        this.dfs(data, startNode, endNode, result);
        break;
      case 'Best First Search':
        this.bestFirstSearch(data, startNode, endNode, result);
        break;
      case 'A* Search':
        this.aStar(data, startNode, endNode, result);
        break;
      case 'Dijkstra':
        this.dijkstra(data, startNode, endNode, result);
        break;
      case 'Jump Point Search':
        this.jumpPointSearch(data, startNode, endNode, result);
        break;
    }
    console.log(result.length);
    this.bestresult = [];
    this.bestRouteBfs(result);
    return this.nodesToAnimate;
  }

  dfs(data: any[], startNode: Node, endNode: Node, result: any[]): boolean {
    if (startNode.colNo < this.cols && startNode.colNo > -1 && startNode.rowNo < this.rows && startNode.rowNo > -1) {
      this.nodesToAnimate.push(_.cloneDeep(startNode));
      startNode.status = 0;
      startNode.visited = true;
      this.setCurrentNode(startNode);
      this.nodesToAnimate.push(startNode);
      if (startNode.colNo === endNode.colNo && startNode.rowNo === endNode.rowNo) {
        const parentArr = this.parentMap.get(startNode.name);
        parentArr.push(startNode);
        this.parentMap.set(startNode.name, parentArr);

        if (this.bestRoute.length == 0)
          this.bestRoute = this.parentMap.get(startNode.name);
        else if (this.bestRoute.length > this.parentMap.get(startNode.name).length)
          this.bestRoute = this.parentMap.get(startNode.name);
        return true;
      }
      else {
        const parentArr = this.parentMap.get(startNode.name);
        parentArr.push(startNode);
        this.parentMap.set(startNode.name, parentArr);
        if (startNode.colNo + 1 < this.cols) {
          let rightNode = data[startNode.rowNo][startNode.colNo + 1];
          if (rightNode.visited !== true && rightNode.wall !== true) {
            this.parentMap.set(rightNode.name, _.clone(parentArr));

            const recres = this.dfs(data, rightNode, endNode, result);
            if (recres)
              return true;
          }
        }
        if (startNode.rowNo + 1 < this.rows) {
          let downNode = data[startNode.rowNo + 1][startNode.colNo];
          if (downNode.visited !== true && downNode.wall !== true) {
            this.parentMap.set(downNode.name, _.clone(parentArr));

            const recres = this.dfs(data, downNode, endNode, result);
            if (recres)
              return true;
          }
        }
        if (startNode.colNo - 1 >= 0) {
          let leftNode = data[startNode.rowNo][startNode.colNo - 1];
          if (leftNode.visited !== true && leftNode.wall !== true) {
            this.parentMap.set(leftNode.name, _.clone(parentArr));

            const recres = this.dfs(data, leftNode, endNode, result);
            if (recres)
              return true;
          }
        }

        if (startNode.rowNo - 1 >= 0) {
          let upNode = data[startNode.rowNo - 1][startNode.colNo];
          if (upNode.visited !== true && upNode.wall !== true) {
            this.parentMap.set(upNode.name, _.clone(parentArr));

            const recres = this.dfs(data, upNode, endNode, result);
            if (recres)
              return true;
          }
        }

      }
    }
    return false;
  }
  bfs(data: any[], startNode: Node, endNode: Node, result: any[]) {
    startNode.dist = 0;
    let queue: Node[] = [startNode];
    let cnt = 0;

    while (queue.length > 0) {
      cnt++;
      startNode = queue.shift();
      startNode['visited'] = true;
      startNode.status = 0;
      this.setCurrentNode(startNode);
      this.nodesToAnimate.push(_.cloneDeep(startNode));
      // result.push(_.cloneDeep(data));
      if (startNode.colNo === endNode.colNo && startNode.rowNo === endNode.rowNo) {
        const parentArr = this.parentMap.get(startNode.name);
        parentArr.push(startNode);
        this.parentMap.set(startNode.name, parentArr);
        this.bestRoute = this.parentMap.get(startNode.name);
        return;
      }
      const parentArr = this.parentMap.get(startNode.name);
      parentArr.push(startNode);
      this.parentMap.set(startNode.name, parentArr);
      if (startNode.colNo + 1 < this.cols) {
        let rightNode = data[startNode.rowNo][startNode.colNo + 1];
        if (rightNode.visited !== true && rightNode.wall !== true) {
          rightNode.visited = true;
          this.parentMap.set(rightNode.name, _.clone(parentArr));
          queue.push(rightNode);
        }
      }
      if (startNode.rowNo + 1 < this.rows) {
        let downNode = data[startNode.rowNo + 1][startNode.colNo];
        if (downNode.visited !== true && downNode.wall !== true) {
          downNode.visited = true;
          this.parentMap.set(downNode.name, _.clone(parentArr));
          queue.push(downNode);
        }
      }
      if (startNode.colNo - 1 >= 0) {
        let leftNode = data[startNode.rowNo][startNode.colNo - 1];
        if (leftNode.visited !== true && leftNode.wall !== true) {
          leftNode.visited = true;
          this.parentMap.set(leftNode.name, _.clone(parentArr));
          queue.push(leftNode);
        }
      }

      if (startNode.rowNo - 1 >= 0) {
        let upNode = data[startNode.rowNo - 1][startNode.colNo];
        if (upNode.visited !== true && upNode.wall !== true) {
          upNode.visited = true;
          this.parentMap.set(upNode.name, _.clone(parentArr));
          queue.push(upNode);
        }
      }

    }

  }
  bestRouteBfs(result: any[]) {
    // const grid=result[result.length-1];
    console.log(this.bestRoute);
    this.bestRoute.forEach((x, i) => {
      if (i>=0&&i<this.bestRoute.length) {
        const node = _.cloneDeep(this.gridData[x.rowNo][x.colNo]);
        node.optimalNode = true;

        this.bestresult.push(_.cloneDeep(node));
      }
    })
  }

  onSelectMoved(obj: Node) {
    if (this.clicked === true && this.lastVisited
      !== obj) {
      if (this.selectedNode === true) {
        if (obj.selected !== true) {
          this.lastVisited.selected = false;
          obj.startNodeFlag=this.lastVisited.startNodeFlag;
          obj.endNodeFlag=this.lastVisited.endNodeFlag;
          this.lastVisited.startNodeFlag=this.lastVisited.startNodeFlag!==undefined?false:undefined;
          this.lastVisited.endNodeFlag=this.lastVisited.endNodeFlag!==undefined?false:undefined;
          obj.selected = true;
          
          if (this.lastVisited.wasWall === true){
            this.lastVisited.wall = true;
            this.lastVisited.status=1;
          }
          if (obj.wall === true)
            obj.wasWall = true;
          obj.wall = false;
          obj.status=undefined

          this.lastVisited = obj;
          if (this.hasAnimated)
            this.noAnimationTraversal();
        }
      }
      else {
        obj.wall = obj.wall === undefined ? true : !obj.wall;
        if(obj.wall)
        obj.status=1;
        else
        obj.status=undefined; 
        this.lastVisited = obj;
      }
      this.movedFlag = true;
    }
  }
  setClickedFalse(obj: Node) {
    this.clicked = false;
    this.lastVisited = null;

    if (this.selectedNode && this.movedFlag === false) {
      obj.selected = true;
      this.selectedNode = false;

      obj.wall = undefined;
      obj.status=undefined; 
      console.log(obj);
    }
    this.selectedNode = false;
  }
  setClickedTrue(obj: Node) {
    this.clicked = true;
    this.lastVisited = null;
    if (obj.selected === true) {
      this.selectedNode = true;
      this.lastVisited = obj;
    }
    this.movedFlag = false;
  }
  clear() {
    this.gridData = _.cloneDeep(this.unsetGrid);
    this.selectedCnt = 0;
    this.nodesToAnimate = [];
    this.hasAnimated = false;
  }
  clearPaths() {
    this.gridData.forEach(x => {
      const nodes: Node[] = x;
      nodes.forEach(y => {
        y.optimalNode = undefined;
        if(y.status==0)
        y.status = undefined;
      })
    })
    this.selectedCnt = 0;
    this.nodesToAnimate = [];
    this.hasAnimated = false;
  }
  clearWallNWeight() {
    this.gridData.forEach(x => {
      const nodes: Node[] = x;
      nodes.forEach(y => {
        if(y.weightStatus>=0)
        y.weightStatus = undefined;
        if(y.status==1){
          y.wall=false;
          y.status=undefined;
        }
      })
    })
    // this.selectedCnt = 0;
    // this.nodesToAnimate = [];
    // this.hasAnimated = false;
  }
  clearPathsForNoAnimation() {
    this.gridData.forEach(x => {
      const nodes: Node[] = x;
      nodes.forEach(y => {
        y.optimalNode = undefined;
        if(y.status==0)
        y.status = undefined;
      })
    })
  }
  setCurrentNode(node: Node) {
    // const temp=[];
    // if(this.currentNodes.length==0){
    //   this.currentNodes.push(node);
    //   return;
    // }
    // if(this.currentNodes.length==3){
    //   this.currentNodes[this.currentNodes.length-1].status=0;
    //   this.currentNodes.splice(this.currentNodes.length-1,1);
    // }
    // node.status=1;
    // temp.push(node);
    //   this.currentNodes.forEach((x,i)=>{
    //     x.status=i+2;
    //     temp.push(x);
    //   })
    //   this.currentNodes=temp;
  }
  aStar(data: any[], startNode: Node, endNode: Node, result: any[]): void {
    this.calculateHeuristic(data, endNode);
    startNode.initialDist = 0;
    const queue = [startNode];
    while (queue.length > 0) {
      queue.sort((a, b) => a.dist - b.dist);
      startNode = queue.shift();
      startNode.visited = true;
      startNode.status = 0;
      this.nodesToAnimate.push(_.cloneDeep(startNode));
      // result.push(_.cloneDeep(data));
      if (startNode.colNo === endNode.colNo && startNode.rowNo === endNode.rowNo) {
        const parentArr = this.parentMap.get(startNode.name);
        parentArr.push(startNode);
        this.parentMap.set(startNode.name, parentArr);
        this.bestRoute = this.parentMap.get(startNode.name);
        return;
      }
      const parentArr = this.parentMap.get(startNode.name);
      parentArr.push(startNode);
      if (startNode.colNo + 1 < this.cols) {
        let rightNode = data[startNode.rowNo][startNode.colNo + 1];
        if (rightNode.visited !== true && rightNode.wall !== true) {
          this.parentMap.set(rightNode.name, _.clone(parentArr));
          rightNode.initialDist = rightNode.weight === undefined ? startNode.initialDist + 1 : startNode.initialDist + rightNode.weight;
          rightNode.dist = rightNode.heuristicDist + rightNode.initialDist;
          rightNode.visited = true;
          queue.push(rightNode);
        }
      }
      if (startNode.rowNo + 1 < this.rows) {
        let downNode = data[startNode.rowNo + 1][startNode.colNo];
        if (downNode.visited !== true && downNode.wall !== true) {

          this.parentMap.set(downNode.name, _.clone(parentArr));
          downNode.initialDist = downNode.weight === undefined ? startNode.initialDist + 1 : startNode.initialDist + downNode.weight;
          downNode.dist = downNode.heuristicDist + downNode.initialDist;
          downNode.visited = true;
          queue.push(downNode);
        }
      }
      if (startNode.colNo - 1 >= 0) {
        let leftNode = data[startNode.rowNo][startNode.colNo - 1];
        if (leftNode.visited !== true && leftNode.wall !== true) {

          this.parentMap.set(leftNode.name, _.clone(parentArr));
          leftNode.initialDist = leftNode.weight === undefined ? startNode.initialDist + 1 : startNode.initialDist + leftNode.weight;
          leftNode.dist = leftNode.heuristicDist + leftNode.initialDist;
          leftNode.visited = true;
          queue.push(leftNode);
        }
      }
      if (startNode.rowNo - 1 >= 0) {
        let upNode = data[startNode.rowNo - 1][startNode.colNo];
        if (upNode.visited !== true && upNode.wall !== true) {
          this.parentMap.set(upNode.name, _.clone(parentArr));
          upNode.initialDist = upNode.weight === undefined ? startNode.initialDist + 1 : startNode.initialDist + upNode.weight;
          upNode.dist = upNode.heuristicDist + upNode.initialDist;
          upNode.visited = true;
          queue.push(upNode);
        }
      }
    }
  }
  calculateHeuristic(data: any[], endNode: Node) {
    data.forEach(x => {
      const arr: Node[] = x;
      arr.forEach(y => {
        const hr = Math.abs(endNode.rowNo - y.rowNo);
        const vr = Math.abs(endNode.colNo - y.colNo);
        y.heuristicDist = hr + vr;
      })
    })
  }
  dijkstra(data: any[], startNode: Node, endNode: Node, result: any[]) {

    this.setDistanceForDijkstra(data, startNode);
    const queue: Node[] = [startNode];
    while (queue.length > 0) {
      queue.sort((a, b) => a.dist - b.dist);
      startNode = queue.shift();
      startNode.visited = true;
      startNode.status = 0;
      // result.push(_.cloneDeep(data));
      this.nodesToAnimate.push(_.cloneDeep(startNode));
      if (startNode.colNo === endNode.colNo && startNode.rowNo === endNode.rowNo) {
        const parentArr = this.parentMap.get(startNode.name);
        parentArr.push(startNode);
        this.parentMap.set(startNode.name, parentArr);
        this.bestRoute = this.parentMap.get(startNode.name);
        return;
      }
      const parentArr = this.parentMap.get(startNode.name);
      parentArr.push(startNode);
      if (startNode.colNo + 1 < this.cols) {
        let rightNode = data[startNode.rowNo][startNode.colNo + 1];
        if (rightNode.visited !== true && rightNode.wall !== true && rightNode.weight === undefined && rightNode.dist > (startNode.dist + 1) || rightNode.dist > (startNode.dist + rightNode.weight)) {
          this.parentMap.set(rightNode.name, _.clone(parentArr));
          rightNode.initialDist = startNode.initialDist + 1;
          rightNode.dist = rightNode.weight === undefined ? startNode.dist + 1 : startNode.dist + rightNode.weight;
          rightNode.visited = true;
          queue.push(rightNode);
        }
      }
      if (startNode.rowNo + 1 < this.rows) {
        let downNode = data[startNode.rowNo + 1][startNode.colNo];
        if (downNode.visited !== true && downNode.wall !== true && downNode.weight === undefined && downNode.dist > (startNode.dist + 1) || downNode.dist > (startNode.dist + downNode.weight)) {

          this.parentMap.set(downNode.name, _.clone(parentArr));

          downNode.dist = downNode.weight === undefined ? startNode.dist + 1 : startNode.dist + downNode.weight;;
          downNode.visited = true;
          queue.push(downNode);
        }
      }
      if (startNode.colNo - 1 >= 0) {
        let leftNode = data[startNode.rowNo][startNode.colNo - 1];
        if (leftNode.visited !== true && leftNode.wall !== true && leftNode.weight === undefined && leftNode.dist > (startNode.dist + 1) || leftNode.dist > (startNode.dist + leftNode.weight)) {

          this.parentMap.set(leftNode.name, _.clone(parentArr));
          leftNode.dist = leftNode.weight === undefined ? startNode.dist + 1 : startNode.dist + leftNode.weight;;
          leftNode.visited = true;
          queue.push(leftNode);
        }
      }
      if (startNode.rowNo - 1 >= 0) {
        let upNode = data[startNode.rowNo - 1][startNode.colNo];
        if (upNode.visited !== true && upNode.wall !== true && upNode.weight === undefined && upNode.dist > (startNode.dist + 1) || upNode.dist > (startNode.dist + upNode.weight)) {
          this.parentMap.set(upNode.name, _.clone(parentArr));
          upNode.dist = upNode.weight === undefined ? startNode.dist + 1 : startNode.dist + upNode.weight;
          upNode.visited = true;
          queue.push(upNode);
        }
      }
    }
  }
  setDistanceForDijkstra(data: any[], startNode: Node) {
    data.forEach(x => {
      const rows: Node[] = x;
      rows.forEach(y => {
        if (y.rowNo == startNode.rowNo && y.colNo == startNode.colNo)
          y.dist = 0;
        else
          y.dist = Number.POSITIVE_INFINITY;
      })
    })
  }
  bestFirstSearch(data: any[], startNode: Node, endNode: Node, result: any[]): void {
    this.calculateHeuristic(data, endNode);
    const queue = [startNode];
    while (queue.length > 0) {
      queue.sort((a, b) => a.heuristicDist - b.heuristicDist);
      startNode = queue.shift();
      startNode.visited = true;
      startNode.status = 0;
      // result.push(_.cloneDeep(data));
      this.nodesToAnimate.push(_.cloneDeep(startNode));
      if (startNode.colNo === endNode.colNo && startNode.rowNo === endNode.rowNo) {
        const parentArr = this.parentMap.get(startNode.name);
        parentArr.push(startNode);
        this.parentMap.set(startNode.name, parentArr);
        this.bestRoute = this.parentMap.get(startNode.name);
        return;
      }
      const parentArr = this.parentMap.get(startNode.name);
      parentArr.push(startNode);
      if (startNode.colNo + 1 < this.cols) {
        let rightNode = data[startNode.rowNo][startNode.colNo + 1];
        if (rightNode.visited !== true && rightNode.wall !== true) {
          this.parentMap.set(rightNode.name, _.clone(parentArr));
          rightNode.visited = true;
          queue.push(rightNode);
        }
      }
      if (startNode.rowNo + 1 < this.rows) {
        let downNode = data[startNode.rowNo + 1][startNode.colNo];
        if (downNode.visited !== true && downNode.wall !== true) {

          this.parentMap.set(downNode.name, _.clone(parentArr));
          downNode.visited = true;
          queue.push(downNode);
        }
      }
      if (startNode.colNo - 1 >= 0) {
        let leftNode = data[startNode.rowNo][startNode.colNo - 1];
        if (leftNode.visited !== true && leftNode.wall !== true) {

          this.parentMap.set(leftNode.name, _.clone(parentArr));
          leftNode.visited = true;
          queue.push(leftNode);
        }
      }
      if (startNode.rowNo - 1 >= 0) {
        let upNode = data[startNode.rowNo - 1][startNode.colNo];
        if (upNode.visited !== true && upNode.wall !== true) {
          this.parentMap.set(upNode.name, _.clone(parentArr));
          upNode.visited = true;
          queue.push(upNode);
        }
      }
    }
  }
  jumpPointSearch(data: any[], startNode: Node, endCell: Node, result: any[]): void {
    let myHeap = [startNode];
    let prev = this.createPrev();
    data.forEach(x => {
      const list: Node[] = x;
      list.forEach(y => {
        if (y.rowNo === startNode.rowNo && y.colNo === startNode.colNo) {
          y.initialDist = 0
          y.dist = 0
        }
        else {

          y.initialDist = Number.POSITIVE_INFINITY
          y.dist = Number.POSITIVE_INFINITY
        }

      })
    })
    startNode.status = 4;
    this.nodesToAnimate.push(startNode);

    while (myHeap.length > 0) {
      myHeap.sort((a, b) => a.dist - b.dist);
      startNode = myHeap.shift();
      let i = startNode.rowNo;
      let j = startNode.colNo;
      if (startNode.visited)
        continue;
      startNode.visited = true;


      startNode.status = 0;
      this.nodesToAnimate.push(startNode);
      if (i == endCell.rowNo && j == endCell.colNo) {
        // const parentArr=this.parentMap.get(startNode.name);
        // parentArr.push(startNode);
        // this.parentMap.set(startNode.name,parentArr);
        // this.bestRoute=this.parentMap.get(startNode.name);
        break;
      }
      const parentArr = this.parentMap.get(startNode.name);
      // parentArr.push(startNode);

      let neighbors = this.pruneNeighbors(i, j, data, endCell);
      for (let k = 0; k < neighbors.length; k++) {
        let m = neighbors[k].rowNo;
        let n = neighbors[k].colNo;
        console.log("k " + neighbors[k].wall);
        if (neighbors[k].visited) { continue; }
        let newDistance = startNode.initialDist + Math.abs(i - m) + Math.abs(j - n);
        if (newDistance < neighbors[k].initialDist) {
          neighbors[k].initialDist = newDistance;
          prev[m][n] = [i, j];
          neighbors[k].status = 4;
          this.nodesToAnimate.push(neighbors[k]);
        }
        let newCost = startNode.initialDist + Math.abs(endCell.rowNo - m) + Math.abs(endCell.colNo - n);
        if (newCost < neighbors[k].dist) {
          neighbors[k].dist = newCost;
          myHeap.push(neighbors[k]);
        }
      }
    }
    // Make any nodes still in the heap "visited"
    while (myHeap.length > 0) {
      myHeap.sort((a, b) => a.dist - b.dist);
      startNode = myHeap.shift();
      if (startNode.visited) { continue; }
      startNode.visited = true;
      startNode.status = 0;
      this.nodesToAnimate.push(startNode);
    }
    let i = endCell.rowNo;
    let j = endCell.colNo;
    this.bestRoute = [];
    while (prev[i][j] != null) {
      let prevCell = prev[i][j];
      let x = prevCell[0];
      let y = prevCell[1];
      //   if(data[x][y].wall){
      //     console.log("sdsdsdsdsd");
      //     i = prevCell[0];
      // 	j = prevCell[1];
      //   continue;  
      // }

      // Loop through and illuminate each cell in between [i, j] and [x, y]
      // Horizontal
      if ((i - x) == 0) {
        // Move right
        if (j < y) {
          for (let k = j; k < y; k++) {
            if (data[i][k].wall) console.warn("amey wall");
            this.bestRoute.push(data[i][k]);
          }
          // Move left
        } else {
          for (let k = j; k > y; k--) {
            if (data[i][k].wall) console.warn("amey wall");
            this.bestRoute.push(data[i][k]);
          }
        }
        // Vertical
      } else {
        // Move down
        if (i < x) {
          for (let k = i; k < x; k++) {
            if (data[k][j].wall) console.warn("amey wall");
            this.bestRoute.push(data[k][j]);
          }
          // Move up
        } else {
          for (let k = i; k > x; k--) {
            if (data[k][j].wall) console.warn("amey wall");
            this.bestRoute.push(data[k][j]);
          }
        }
      }
      i = prevCell[0];
      j = prevCell[1];
      if (data[i][j].wall) console.warn("amey wall");
      this.bestRoute.push(data[i][j]);
    }
  }


  pruneNeighbors(i, j, data, endNode) {
    let neighbors = [];
    let stored = {};
    // Scan horizontally
    for (let num = 0; num < 2; num++) {
      let direction = "right";
      let increment = 1;
      if (!num) {
        direction = "right";
        increment = 1;
      } else {
        direction = "left";
        increment = -1;
      }
      for (let c = j + increment; (c < this.cols) && (c >= 0); c += increment) {
        let xy = i + "-" + c;
        if (data[i][c].visited) { break; }
        //Check if same row or column as end cell
        if ((endNode.rowNo == i || endNode.colNo == c) && !stored[xy]) {
          neighbors.push(data[i][c]);
          stored[xy] = true;
          continue;
        }
        // Check if dead end
        let deadEnd = !(xy in stored) && ((direction == "left" && (c > 0) && data[i][(c - 1)].wall === true) || (direction == "right" && c < (this.cols - 1) && data[i][(c + 1)].wall === true) || (c == this.cols - 1) || (c == 0));
        if (deadEnd) {
          neighbors.push(data[i][c]);
          stored[xy] = true;
          break;
        }
        //Check for forced neighbors
        let validForcedNeighbor = (direction == "right" && c < (this.cols - 1) && (data[i][(c + 1)].wall === false)) || (direction == "left" && (c > 0) && (data[i][(c - 1)].wall === false));
        if (validForcedNeighbor) {
          this.checkForcedNeighbor(data, i, c, direction, neighbors, stored);
        }
      }
    }
    // Scan vertically
    for (let num = 0; num < 2; num++) {
      let direction = "down";
      let increment = 1;
      if (!num) {
        direction = "down";
        increment = 1;
      } else {
        direction = "up";
        increment = -1;
      }
      for (let r = i + increment; (r < this.rows) && (r >= 0); r += increment) {
        let xy = r + "-" + j;
        if (data[r][j].visited) { break; }
        if ((endNode.rowNo == r || endNode.colNo == j) && !stored[xy]) {
          neighbors.push(data[r][j]);
          stored[xy] = true;
          continue;
        }
        // Check if dead end
        let deadEnd = !(xy in stored) && ((direction == "up" && (r > 0) && data[(r - 1)][j].wall === true) || (direction == "down" && r < (this.rows - 1) && data[(r + 1)][j].wall === true) || (r == this.rows - 1) || (r == 0));
        if (deadEnd) {
          neighbors.push(data[r][j]);
          stored[xy] = true;
          break;
        }
        //Check for forced neighbors
        let validForcedNeighbor = (direction == "down" && (r < (this.rows - 1)) && (data[(r + 1)][j].wall === false)) || (direction == "up" && (r > 0) && (data[(r - 1)][j].wall === false));
        if (validForcedNeighbor) {
          this.checkForcedNeighbor(data, r, j, direction, neighbors, stored);
        }
      }
    }
    return neighbors;
  }

  checkForcedNeighbor(data, i, j, direction, neighbors, stored) {
    //console.log(JSON.stringify(walls));
    let neighbor = null;
    let isForcedNeighbor = null;
    if (direction == "right") {
      isForcedNeighbor = ((i > 0) && data[(i - 1)][j].wall === true && (data[(i - 1)][(j + 1)].wall === false)) || ((i < (this.rows - 1)) && data[(i + 1)][j].wall === true && (data[(i + 1)][(j + 1)].wall === false));
      neighbor = data[i][j + 1];
    } else if (direction == "left") {
      isForcedNeighbor = ((i > 0) && data[(i - 1)][j].wall === true && data[(i - 1)][(j - 1)].wall === false) || ((i < (this.rows - 1)) && data[(i + 1)][j].wall === true && data[(i + 1)][(j - 1)].wall === false);
      neighbor = data[i][j - 1];
    } else if (direction == "up") {
      isForcedNeighbor = ((j < (this.cols - 1)) && data[i][(j + 1)].wall === true && data[(i - 1)][(j + 1)].wall === false) || ((j > 0) && data[i][(j - 1)].wall === true && data[(i - 1)][(j - 1)].wall === false);
      neighbor = data[i - 1][j];
    } else {
      isForcedNeighbor = ((j < (this.cols - 1)) && data[i][(j + 1)].wall === true && data[(i + 1)][(j + 1)].wall === false) || ((j > 0) && data[i][(j - 1)].wall === true && data[(i + 1)][(j - 1)].wall === false);
      neighbor = data[(i + 1)][j];
    }
    let xy = neighbor.rowNo + "-" + neighbor.colNo;
    if (isForcedNeighbor && !stored[xy]) {
      //console.log("Neighbor " + JSON.stringify(neighbor) + " is forced! Adding to neighbors and stored.")
      neighbors.push(neighbor);
      stored[xy] = true;
    } else {
      //console.log("Is not a forced neighbor..");
    }
    //return;
  }
  createPrev() {
    let prev = [];
    for (let i = 0; i < this.rows; i++) {
      let row = [];
      for (let j = 0; j < this.cols; j++) {
        row.push(null);
      }
      prev.push(row);
    }
    return prev;
  }

  recursiveDivisionMaze() {
    this.addEndWall();
    console.log(this.nodesToAnimate);
    const isPassage = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      isPassage[i] = [];
    }
    isPassage.forEach(x => {
      x = new Array(this.cols);
      x.forEach(y => y = false);
    })
    console.log(isPassage);
    let firstRow = 1;
    let lastRow = this.gridData.length - 2;
    let firstCol = 1;
    let lastCol = this.gridData[0].length - 2;

    let orientation = null;
    switch (this.selectedRDOrientation) {
      case "Vertical Skewed Recurcise Division":
        orientation = this.chooseVerticalOrientation(this.gridData, firstRow, lastRow, firstCol, lastCol);
        break;
      case "Horizontal Skewed Recurcise Division":
        orientation = this.chooseHorizontalOrientation(this.gridData, firstRow, lastRow, firstCol, lastCol);
        break;
      default:
        orientation = this.chooseOrientation(this.gridData, firstRow, lastRow, firstCol, lastCol);
        break;
    }

    this.divide(this.gridData, firstRow, lastRow, firstCol, lastCol, orientation, null, isPassage);
    return this.nodesToAnimate;
  }
  chooseOrientation(grid, firstRow, lastRow, firstCol, lastCol) {
    let width = lastCol - firstCol;
    let height = lastRow - firstRow;
    if (width > height) {
      return 'Vertical'
    } else if (height > width) {
      return 'Horizontal'
    } else {
      const num = Math.random();
      return (num < 0.5) ? 'Vertical' : 'Horizontal'
    }
  }

  chooseVerticalOrientation(grid, firstRow, lastRow, firstCol, lastCol) {
    let width = lastCol - firstCol;
    let height = lastRow - firstRow;
    if (width > height) {
      return 'Vertical'
    } else if (height > width) {
      const num = Math.random();
      return (num < 0.565) ? 'Vertical' : 'Horizontal'
    } else {
      const num = Math.random();
      return (num <= 0.55) ? 'Vertical' : 'Horizontal'
    }
  }
  chooseHorizontalOrientation(grid, firstRow, lastRow, firstCol, lastCol) {
    let width = lastCol - firstCol;
    let height = lastRow - firstRow;
    if (width > height) {
      const num = Math.random();
      return (num < 0.565) ? 'Horizontal' : 'Vertical';
    } else if (height > width) {
      return 'Horizontal'
    } else {
      const num = Math.random();
      return (num <= 0.55) ? 'Vertical' : 'Horizontal'
    }
  }
  divide(grid, firstRow, lastRow, firstCol, lastCol, orientation, nodesToAnimate, isPassage) {
    let width = lastCol - firstCol + 1;
    let height = lastRow - firstRow + 1;
    let firstValidRow = firstRow;
    let lastValidRow = lastRow;
    let firstValidCol = firstCol;
    let lastValidCol = lastCol;
    if (orientation == 'Horizontal') {
      firstValidRow += 1
      lastValidRow -= 1
    } else {
      firstValidCol += 1
      lastValidCol -= 1
    }
    let validWidth = lastValidCol - firstValidCol + 1;
    let validHeight = lastValidRow - firstValidRow + 1;

    if (width < 2 || height < 2 || validHeight < 1 || validWidth < 1) return;

    if (orientation == 'Horizontal') {


      let rowIdxToBeWall = Math.floor(Math.random() * validHeight) + firstValidRow;
      //let passageIdx = Math.floor(Math.random() * validWidth) + firstValidCol;

      let passageIdx;
      if (isPassage[rowIdxToBeWall][firstCol - 1]) {
        passageIdx = firstCol;
      } else if (isPassage[rowIdxToBeWall][lastCol + 1]) {
        passageIdx = lastCol;
      } else {
        passageIdx = Math.random() > 0.5 ? firstCol : lastCol; // random end assignment
      }

      grid[rowIdxToBeWall].forEach((cell, index) => {
        if (cell.selected === true) {
          isPassage[rowIdxToBeWall][index] = true;
        }
        if (isPassage[rowIdxToBeWall][index]) return
        if (index < firstValidCol || index > lastValidCol) return;
        if (index == passageIdx) {
          isPassage[rowIdxToBeWall][index] = true;
          return
        }
        cell.wall=true;
        const cell1=_.cloneDeep(cell);
        cell1.status=1;
        this.nodesToAnimate.push(_.cloneDeep(cell1));
      })
      // upper side
      let orientation = null;
      switch (this.selectedRDOrientation) {
        case "Vertical Skewed Recurcise Division":
          orientation = this.chooseVerticalOrientation(grid, firstRow, rowIdxToBeWall - 1, firstCol, lastCol);
          break;
        case "Horizontal Skewed Recurcise Division":
          orientation = this.chooseHorizontalOrientation(grid, firstRow, rowIdxToBeWall - 1, firstCol, lastCol);
          break;
        default:
          orientation = this.chooseOrientation(grid, firstRow, rowIdxToBeWall - 1, firstCol, lastCol);
          break;
      }

      this.divide(grid, firstRow, rowIdxToBeWall - 1, firstCol, lastCol, orientation, nodesToAnimate, isPassage);

      //Bottom side
      switch (this.selectedRDOrientation) {
        case "Vertical Skewed Recurcise Division":
          orientation = this.chooseVerticalOrientation(grid, rowIdxToBeWall + 1, lastRow, firstCol, lastCol);
          break;
        case "Horizontal Skewed Recurcise Division":
          orientation = this.chooseHorizontalOrientation(grid, rowIdxToBeWall + 1, lastRow, firstCol, lastCol);
          break;
        default:
          orientation = this.chooseOrientation(grid, rowIdxToBeWall + 1, lastRow, firstCol, lastCol);
          break;
      }
      this.divide(grid, rowIdxToBeWall + 1, lastRow, firstCol, lastCol, orientation, nodesToAnimate, isPassage);
    } else {

      let colIdxToBeWall = Math.floor(Math.random() * validWidth) + firstValidCol;
      //let passageIdx = Math.floor(Math.random() * validHeight) + firstValidRow;
      let passageIdx;
      if (firstRow - 1 >= 0 && isPassage[firstRow - 1][colIdxToBeWall]) {
        passageIdx = firstRow;
      } else if (lastRow + 1 < grid.length && isPassage[lastRow + 1][colIdxToBeWall]) {
        passageIdx = lastRow;
      } else {
        passageIdx = Math.random() > 0.5 ? firstRow : lastRow; // random end assignment
      }
      grid.forEach((row, index) => {

        if (index < firstValidRow || index > lastValidRow) return;
        if (index == passageIdx) {
          isPassage[index][colIdxToBeWall] = true;
          return;
        }
        row.forEach((cell, idx) => {
          if (cell.selected === true) {
            isPassage[index][idx] = true;
          }
          if (isPassage[index][idx]) return;

          if (idx == colIdxToBeWall){
            cell.wall=true;
        const cell1=_.cloneDeep(cell);
        cell1.status=1;
        this.nodesToAnimate.push(_.cloneDeep(cell1));
        }
            
        })
      });
      //left side
      switch (this.selectedRDOrientation) {
        case "Vertical Skewed Recurcise Division":
          orientation = this.chooseVerticalOrientation(grid, firstRow, lastRow, firstCol, colIdxToBeWall - 1);
          break;
        case "Horizontal Skewed Recurcise Division":
          orientation = this.chooseHorizontalOrientation(grid, firstRow, lastRow, firstCol, colIdxToBeWall - 1);
          break;
        default:
          orientation = this.chooseOrientation(grid, firstRow, lastRow, firstCol, colIdxToBeWall - 1);
          break;
      }

      this.divide(grid, firstRow, lastRow, firstCol, colIdxToBeWall - 1, orientation, nodesToAnimate, isPassage);
      //right side
      switch (this.selectedRDOrientation) {
        case "Vertical Skewed Recurcise Division":
          orientation = this.chooseVerticalOrientation(grid, firstRow, lastRow, colIdxToBeWall + 1, lastCol);
          break;
        case "Horizontal Skewed Recurcise Division":
          orientation = this.chooseHorizontalOrientation(grid, firstRow, lastRow, colIdxToBeWall + 1, lastCol);
          break;
        default:
          orientation = this.chooseOrientation(grid, firstRow, lastRow, colIdxToBeWall + 1, lastCol);
          break;
      }
      this.divide(grid, firstRow, lastRow, colIdxToBeWall + 1, lastCol, orientation, nodesToAnimate, isPassage);

    }

  }
  addEndWall() {
    this.gridData.forEach((x, i) => {
      const row: Node[] = x;
      row.forEach((y, j) => {
        if (y.selected !== true && (i == 0 || i == this.gridData.length - 1)) {
          y.wall=true;
          y=_.cloneDeep(y);
          y.status=1;
          this.nodesToAnimate.push(y);
        }
        else if (y.selected !== true && (j == 0 || j == row.length - 1)){
          y.wall=true;
          y=_.cloneDeep(y);
          y.status=1;
          this.nodesToAnimate.push(y);
        }
      });
    })
  }
  noAnimationTraversal() {
    this.clearPathsForNoAnimation();
    this.animateResult = this.search(_.cloneDeep(this.gridData));
    this.index = 0;
    console.log(this.animateResult);
    if (this.animateResult !== undefined) {
      while (this.index < this.animateResult.length) {
        this.gridData[this.animateResult[this.index].rowNo][this.animateResult[this.index].colNo].status = this.animateResult[this.index].status;
        this.index++;
      }
      this.index = 1;
      while (this.index < this.bestresult.length-1) {
        this.gridData[this.bestresult[this.index].rowNo][this.bestresult[this.index].colNo].optimalNode = this.bestresult[this.index].optimalNode;
        this.index++;
      }
    }
  }
  recursiveBack(grid) {

    //set all as wall and avoid start and end node
    // this.hasAnimated=true; 
    this.setAllWall(grid);
  //   setTimeout(()=>{
  //     this.hasAnimated=false;  
  // },100)
    
    //set all visited to false and return arr[][];
    this.wallAnimation=false;
    const visited = this.getVisitedMatrix();

    const nodesToRemoveWall = [];

    let [currentRow, currentCol] = [1, 1];

    visited[currentRow][currentCol] = true;

    let stack = []
    while (true) {
      //counter += 1;
      const res:Node=_.clone(grid[currentRow][currentCol]);
      res.status=3;
      grid[currentRow][currentCol].wall=false;
      nodesToRemoveWall.push(res);

      let next = this.getRBNeighbors(currentRow, currentCol, grid, visited);

      if (next) {
        stack.push(next);

        let [nextRow, nextCol] = next;

        visited[nextRow][nextCol] = true;

        let wall = this.getCellBeetween(currentRow, currentCol, nextRow, nextCol, grid);
        // console.log(wall);
        wall.wall=false;
        const res:Node=_.cloneDeep(wall);
        res.status=3;
        nodesToRemoveWall.push(res);
        currentRow = nextRow;
        currentCol = nextCol;

      } else {

        if (stack.length > 0) {

          next = stack.pop();

          let [nextRow, nextCol] = next;

          currentRow = nextRow;
          currentCol = nextCol;
        } else {
          break;
        }

      }
    }
    // this.hasAnimated=false;
    return nodesToRemoveWall;
  }

  //--------------------------------------
  //     Recursive Backtracker Helper functions
  //-----------------------------------------

  getCellBeetween(row1, col1, row2, col2, grid) {
    if (row1 == row2) {
      if (col1 > col2) {
        return grid[row1][col2 + 1]
      } else {
        return grid[row1][col1 + 1]
      }

    } else if (col1 === col2) {
      if (row2 > row1) {
        return grid[row1 + 1][col1]
      } else {
        return grid[row2 + 1][col1]
      }
    }
  }

  getRBNeighbors(currentRow, currentCol, grid, visited) {

    let possibleNeighbors = [
      [currentRow + 2, currentCol],
      [currentRow - 2, currentCol],
      [currentRow, currentCol + 2],
      [currentRow, currentCol - 2]
    ]


    let neighbors = [];

    for (let i = 0; i < possibleNeighbors.length; i++) {
      let [row, col] = possibleNeighbors[i];
      if (row < 1 || row > grid.length - 2 || col < 1 || col > grid[0].length - 2) continue;
      if (visited[row][col]) continue;
      neighbors.push([row, col])
    }

    if (neighbors.length > 0) {
      const nextIdx = Math.floor(Math.random() * neighbors.length);
      return neighbors[nextIdx];
    } else {
      return;
    }

  }
  setAllWall(data:any[]){
    data.forEach(x=>{
      const nodes:Node[]=x;
      nodes.forEach(y=>{
        if(y.selected!==true){
        y.wall=true;
        y.status=2;
        }
      })
    })
  }
  getVisitedMatrix(){
    const result:any[]=[];
    for(let x=0;x<this.rows;x++){
      const row:boolean[]=[];
      for(let y=0;y<this.cols;y++){
        row.push(false);
      }
      result.push(row);
    }
    return result;
  }
  randomMaze() {
    this.addEndWall();
    console.log(this.nodesToAnimate);
    const isPassage = new Array(this.rows);
    for (let i = 0; i < this.rows; i++) {
      isPassage[i] = [];
    }
    isPassage.forEach(x => {
      x = new Array(this.cols);
      x.forEach(y => y = false);
    })
    console.log(isPassage);
    let firstRow = 1;
    let lastRow = this.gridData.length - 2;
    let firstCol = 1;
    let lastCol = this.gridData[0].length - 2;

    let orientation = null;
    
    let start=null;
    let end=null;
    this.gridData.forEach(x=>{
      const nodes:Node[]=x;
      nodes.forEach(y=>{
        if(y.selected){
          if(start!==null)
          end=y;
          else 
          start=y;
        }
      })
    })

    this.randomDivide(this.gridData,start,end);
    return this.nodesToAnimate;
  }
  randomDivide(grid:any[],startNode,endNode) {


      grid.forEach((x,ind)=>{
        if(ind!==0&&ind!==(this.rows-1)){

        
        const indexSet= this.randomGridNodeList(1,this.cols-1);
        const pathIdx=Math.floor(Math.random()*(this.cols-2));
        const nodes:Node[]=x;
        nodes.forEach(y=>{
          if(indexSet.has(y.colNo)&&y.selected!==true&&pathIdx!==y.colNo){
            y.wall=true;

            const temp=_.clone(y);
            temp.status=1;
            this.nodesToAnimate.push(temp);
          }
        })
      }
      });
    
    this.forcedBuildPath(startNode);
    this.forcedBuildPath(endNode);
    

    return this.nodesToAnimate;

  }
  randomGridNodeList(start,end){
    let len=end-start;
    const res:Set<number>=new Set<number>();
    let cnt=Math.floor(Math.random()*(len/2));
    while(cnt>0){
      res.add(Math.floor(Math.random()*len));
      // len--;
      cnt--;
    }
    return res;
  }
  forcedBuildPath(startNode){
    let cnt=0;
    if(startNode.rowNo+1<this.rows-1&&this.gridData[startNode.rowNo+1][startNode.colNo].wall){
      cnt++;
    }  
    if(startNode.rowNo-1>0&&this.gridData[startNode.rowNo-1][startNode.colNo].wall){
      cnt++;
    }
    if(startNode.colNo+1<this.cols-1&&this.gridData[startNode.rowNo][startNode.colNo+1].wall){
      cnt++;
    }
    if(startNode.colNo-1>0&&this.gridData[startNode.rowNo][startNode.colNo-1].wall){
      cnt++;
    }
    if(cnt>=3){
      cnt=3;
      if(startNode.rowNo+1<this.rows-1&&this.gridData[startNode.rowNo+1][startNode.colNo].wall&&cnt>=0){
        this.gridData[startNode.rowNo+1][startNode.colNo].wall=false;
        this.gridData[startNode.rowNo+1][startNode.colNo].status=undefined;
        cnt--;
      }  
      if(startNode.rowNo-1>0&&this.gridData[startNode.rowNo-1][startNode.colNo].wall&&cnt>=0){
        this.gridData[startNode.rowNo-1][startNode.colNo].wall=false;
        this.gridData[startNode.rowNo+1][startNode.colNo].status=undefined;
        cnt--;
      }
      if(startNode.colNo+1<this.cols-1&&this.gridData[startNode.rowNo][startNode.colNo+1].wall&&cnt>=0){
        this.gridData[startNode.rowNo][startNode.colNo+1].wall=false;
        this.gridData[startNode.rowNo+1][startNode.colNo].status=undefined;
        cnt--;
      }
      if(startNode.colNo-1>0&&this.gridData[startNode.rowNo][startNode.colNo-1].wall&&cnt>=0){
        this.gridData[startNode.rowNo][startNode.colNo-1].wall=false;
        this.gridData[startNode.rowNo+1][startNode.colNo].status=undefined;
        cnt--;
      } 
    }
  }
  randomWeight(grid:any[]) {
    const weights=[5,15,30,50];
    grid.forEach((x,ind)=>{
      const indexSet= this.randomWeightGridNodeList(0,this.cols-1);
      const nodes:Node[]=x;
      nodes.forEach(y=>{
        if(indexSet.has(y.colNo)&&y.selected!==true&&y.wall!==true){
          const weightidx=Math.floor(Math.random()*4);          
          y.weight=weights[weightidx];
          const temp=_.clone(y);
          temp.weightStatus=weightidx;
          this.nodesToAnimate.push(temp);
        }
      })
    });
  return this.nodesToAnimate;
}
randomWeightGridNodeList(start,end){
  let len=end-start;
  const res:Set<number>=new Set<number>();
  let cnt=Math.floor(Math.random()*(len+1));
  while(cnt>0){
    res.add(Math.floor(Math.random()*len));
    // len--;
    cnt--;
  }
  return res;
}
openFile(ev) {
  this.videoFlag=false;
  this.mazeFlag=false;
  let file=ev.target.files[0];
  let imageType =/image.*/;
  if(file.type.match(imageType)){
    
    var reader = new FileReader();
  reader.onloadend=((event)=>{
    let tempImageStore=new Image();
    tempImageStore.onload=((imageEv)=>{
     
      const target=imageEv.target as HTMLImageElement;
      console.log(target.width+" "+target.height);
      this.nodesToAnimate=[];
      this.readImageData(tempImageStore,target.width,target.height);
    });
    tempImageStore.src=event.target.result as string;
  });
  reader.readAsDataURL(file);
  }
}
readImageData(imageObj:any,width,height){
  let canvas = document.createElement('canvas');
  let context = canvas.getContext('2d');
  context.drawImage(imageObj, 0, 0,this.cols,this.rows);
  // this.clear();
  let i=0,j=0;
  const weightArr=[5,15,30,50];
  while(i<this.rows){
    j=0;
    while(j<this.cols){
      let pixelDensity=this.calculatePixelDensity(i,j,width,height,context);
      if(this.videoFlag&&!this.mazeFlag){
      let diff=this.treshold!==127?Math.floor((this.treshold-126)*1.25):0;
      pixelDensity=pixelDensity+diff<0?0:pixelDensity+diff>255?255:pixelDensity+diff;
      }
      
      
      const cell=this.gridData[i][j];
      const duplCell=_.clone(cell);
      if(this.mazeFlag){
        let tresWeight=this.treshold*0.25;
        let minTres=this.treshold-tresWeight;
        let maxTres=this.treshold+tresWeight;
        if(pixelDensity<=this.treshold){
          cell.wall=true;
        cell.status=2;
        }
        else
        {
          cell.wall=false;
        cell.status=undefined;
        }
        
      }
      else{
        if(this.treshold<=0)
      pixelDensity=0;
      else if(this.treshold>=255)
      pixelDensity=255;
      if(pixelDensity>=0&&pixelDensity<64){
            cell.weight=weightArr[3];
            if(this.videoFlag)cell.weightStatus=7;
            else duplCell.weightStatus=3;
            duplCell.weight=weightArr[3]; 
      }
      else if(pixelDensity>=64&&pixelDensity<128){
        cell.weight=weightArr[2];
            duplCell.weightStatus=2;
            if(this.videoFlag)cell.weightStatus=6
            duplCell.weight=weightArr[2];
      }
      else if(pixelDensity>=128&&pixelDensity<192){
        cell.weight=weightArr[1];
        duplCell.weightStatus=1;
        if(this.videoFlag)cell.weightStatus=5
        duplCell.weight=weightArr[1];
      }
      else{
        cell.weight=weightArr[0];
        if(this.videoFlag)cell.weightStatus=4
        duplCell.weightStatus=0;
        duplCell.weight=weightArr[0];
      } 
      }
      j++;
      if(!this.videoFlag)
      this.nodesToAnimate.push(duplCell);
    }  
    i++;
  }
  if(!this.videoFlag)
  this.animateWallsAndWeightSeparate();
}
calculatePixelDensity(reqi:number,reqj:number,width:number,height:number,context:CanvasRenderingContext2D){
  let pixelData:Uint8ClampedArray;    
  let sum=0;
  let diffx=Math.floor(width/this.cols);
  let diffy=Math.floor(height/this.rows);
  let i=reqi;
  let j=reqj;  
  let tempj=reqj*diffx;
  let cnt=0;
  let maxi=i+diffy;
  let maxj=j+diffx;
  
  // while(i<height&&i<(maxi)){
  //   j=tempj;
  //   while(j<width&&j<(maxj)){
  //     pixelData=context.getImageData(j, i, 1, 1).data;
  //     let pixelRGB=pixelData[0]+pixelData[1]+pixelData[2];
  //     let pixelDensity=Math.floor(pixelRGB/3);
  //     sum+=pixelDensity;
  //     cnt++;
  //     j++;
  //   }
  //   i++;
  // }
  // if(sum==0&&cnt==0)
  // return 255; 
  // Math.floor(Math.random()*255);
  pixelData=context.getImageData(j, i, 1, 1).data;
      let pixelRGB=pixelData[0]+pixelData[1]+pixelData[2];
      let pixelDensity=Math.floor(pixelRGB/3);
      sum+=pixelDensity;
  
  return pixelDensity;
 
}
hasGetUserMedia() {
  return !!(navigator.mediaDevices &&
    navigator.mediaDevices.getUserMedia);
}
video(){
this.videoFlag=true;
const video:HTMLVideoElement = document.querySelector('#video');
const videoCanvas:HTMLCanvasElement = document.querySelector('#video-canvas');
let videoCtx = videoCanvas.getContext("2d");
navigator.mediaDevices.getUserMedia({
  video: true, 
  audio:false
}).then( stream => {
  video.srcObject = stream;
  video.play();
  video.onplaying=(()=>{
    setInterval(() => {
      this.readImageData(video,this.cols,this.rows);
    }, 50);
    // setTimeout(() => { ;}, 50);
  })
}).catch( error => console.log(error));
// video.addEventListener('play',function(){
//   let videoCtx = videoCanvas.getContext("2d");
//   setTimeout(() => { draw(this,videoCtx,videoCanvas) }, 50);
// })
// function draw(video,videoCtx,videoCanvas){
//   videoCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height); 
// }
setTimeout(() => { console.log("fuck u"); }, 50);
}
draw(video,videoCtx,videoCanvas){
    videoCtx.drawImage(video, 0, 0, videoCanvas.width, videoCanvas.height); 
    console.log("fuck u");
}
setAlgorithm(event){
  this.algoDesc=this.algoToDescMap.get(event);
}  
}
interface Node {
  name: string,
  selected: boolean,
  rowNo: number,
  colNo: number,
  visited?: boolean,
  dist: number,
  optimalNode?: boolean,
  wall?: boolean,
  status?: number,
  heuristicDist?: number,
  initialDist?: number,
  weight?: number,
  wasWall?: boolean,
  weightStatus?:number,
  startNodeFlag?:boolean,
  endNodeFlag?:boolean
}
