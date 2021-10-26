let caseNum = 0;
let caseImageNum = 0; // setInterval에 사용되는 case index

(() => {
  let start = new Date(); 
  let prevScrollHeight = 0; // 현재 스크롤 위치(yOffset)보다 이전에 위치한 스크롤 섹션들의 스크롤 높이값의 합
  let currentScene = 0;

  let yOffset = 0; // window.pageYOffset 대신 쓸 변수

  let delayedYOffset = 0;
  let acc = 0.7;
  let rafId;
  let rafState = false;
  let caseIntervalId = null;
  let onCase = false;
  
  
  // CASE STUDY
  let typeArr = ["sticky","sticky","sticky","sticky","sticky","normal"];
  
  let sceneInfo=[
    {
      type:typeArr[0],
      heightNum:1.3,
      scrollHeight:0,
      objs:{
          container: document.querySelector('#scroll-section-0'),
          h1title: document.querySelector('.h1title'),
          canvas: document.querySelector('#video-canvas-0'),
          context: document.querySelector('#video-canvas-0').getContext('2d'),
          videoImages:[]
      },
      values: {
              // MainFloating
              videoImageCount:340,
              imageSequence: [0,170],
              // MainBottom
              canvas_opacity: [1,0,{start:0.9, end:1}],

              h1title_opacity_in: [0, 1, { start: 0.1, end: 0.4 }],
              h1title_opacity_out: [1, 0, { start: 0.95, end: 1 }],
              h1title_translateY_in: [20, 0, { start: 0.1, end: 0.4 }],
              h1title_translateY_out: [0, -20, { start: 0.9, end:1 }],
              h1title_scale_out: [1, 0, { start: 0.95, end:1 }],
          }
    },
    {
      type:typeArr[1],
      heightNum:5,
      scrollHeight:0,
      objs:{
        container: document.querySelector('#scroll-section-1'),
        canvas: document.querySelector('#jenga-blend-canvas'),
        context: document.querySelector('#jenga-blend-canvas').getContext('2d'),
        solution: document.querySelector('#scroll-section-1 .flex-box'),
        solutionTitle: document.querySelector('#scroll-section-1 .solution-title'),
        solutionWhy: document.querySelector('#scroll-section-1 .solution-why-wrapper'),
        solutionHow: document.querySelector('#scroll-section-1 .solution-how-wrapper'),
        videoImages:[],
      },
      values: {
              videoImageCount:149,
              imageSequence: [0,74],
              background_opacity_in:[0,1,{start:0, end:0.1}],
              background_opacity_out:[1,1,{start:0.95, end:1}],
              solution_title_opacity_in: [0, 1, { start: 0, end: 0.3 }],
              solution_title_opacity_out: [1, 0, { start: 0.9, end: 1 }],
              solution_title_translateY_in: [20, 0, { start: 0, end: 0.3 }],
              solution_title_translateY_out: [0, -20, { start: 0.95, end: 1 }],
              canvas_opacity_in: [0, 1, { start: 0.25, end: 0.45 }],
              canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
              solution_translateY_in: [20, 0, { start: 0, end: 0.3 }],
              solution_translateY_out: [0, -20, { start: 0.95, end: 1 }],
              
              solution_why_opacity_in: [0, 1, { start: 0.4, end: 0.5 }],
              solution_why_opacity_out: [1, 0, { start: 0.65, end: 0.7 }],
              solution_why_translateY: [100, 0, { start: 0.4, end: 0.6 }],
              solution_how_opacity_in: [0, 1, { start: 0.7, end: 0.8 }],
              solution_how_opacity_out: [1, 0, { start: 0.95, end: 1 }],
              solution_how_translateY: [100, 0, { start: 0.7, end: 0.9 }],
          },
    },
    {
      type:typeArr[2],
      heightNum:5,
      scrollHeight:0,
      objs: {
              container: document.querySelector('#scroll-section-2'),
              canvas: document.querySelector('#light-blend-canvas'),
              context: document.querySelector('#light-blend-canvas').getContext('2d'),
              solution: document.querySelector('#scroll-section-2 .flex-box'),
              solutionTitle: document.querySelector('#scroll-section-2 .solution-title'),
              solutionWhy: document.querySelector('#scroll-section-2 .solution-why-wrapper'),
              solutionHow: document.querySelector('#scroll-section-2 .solution-how-wrapper'),
              caseWrapper: document.querySelector('#scroll-section-3 .case-wrapper'),
              videoImages:[],
      },
      values: {
              videoImageCount:129,
              imageSequence: [0,64],
              solution_translateY_in: [20, 0, { start: 0.1, end: 0.3 }],
              solution_translateY_out: [0, -20, { start: 0.95, end: 1 }],
              solution_title_opacity_in: [0, 1, { start: 0.0, end: 0.15 }],
              solution_title_opacity_out: [1, 0, { start: 0.95, end: 1 }],
              solution_title_translateY_in: [20, 0, { start: 0, end: 0.15 }],
              canvas_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
              canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
              solution_why_opacity_in: [0, 1, { start: 0.2, end: 0.25 }],
              solution_why_opacity_out: [1, 0, { start: 0.4, end: 0.5 }],
              solution_why_translateY: [100, 0, { start: 0.2, end: 0.3 }],
              solution_how_opacity_in: [0, 1, { start: 0.5, end: 0.55 }],
              solution_how_translateY: [100, 0, { start: 0.5, end: 0.6 }],
              solution_how_opacity_out: [1, 0, { start: 0.95, end: 1 }],

              //case Study 미리 띄우기
              case_wrapper_opacity: [0, 1, { start: 0.6, end: 0.95 }],
              case_wrapper_translateY: [200, 0, { start: 0.6, end: 1 }],
          },
    },
    {
      type:typeArr[3],
      heightNum:2,
      scrollHeight:0,
      objs:{
        container: document.querySelector('#scroll-section-3'),
        caseTitle: document.querySelector('#scroll-section-3 .case-title'),
        caseWrapper: document.querySelector('#scroll-section-3 .case-wrapper'),
        gridWrapper: document.querySelector('#scroll-section-4 .grid-wrapper'),
      },
      values: {
        case_wrapper_opacity: [1, 0, { start: 0.9, end: 0.95 }],
        case_wrapper_translateY: [0, -100, { start: 0.5, end: 1 }],
        grid_opacity: [0, 1, { start: 0.5, end: 1 }],
        grid_translateY: [100, 10, { start: 0.5, end: 1 }],
      }
    },
    {
      type:typeArr[4],
      heightNum:1.5,
      scrollHeight:0,
      objs:{
        container: document.querySelector('#scroll-section-4'),
        gridWrapper: document.querySelector('#scroll-section-4 .grid-wrapper'),
      },
      values: {
          grid_translateY: [10, 0, { start: 0, end: 0.1 }],
      }
    },
    {
      type:typeArr[5],
      scrollHeight:0,
      objs:{
        container: document.querySelector('#scroll-section-5')
      }
    }
  ];

  function setLayout(){
    
    //모바일 레이아웃 변경되는 부분 처리
    if(window.innerWidth<800){
      typeArr = ["sticky","normal","normal","sticky","sticky","normal"];
      sceneInfo[0] ={
        type:typeArr[0],
        heightNum:1.5,
        scrollHeight:0,
        objs:{
            container: document.querySelector('#scroll-section-0'),
            h1title: document.querySelector('.h1title'),
            canvas: document.querySelector('#video-canvas-0'),
            context: document.querySelector('#video-canvas-0').getContext('2d'),
            videoImages:[]
        },
        values: {
                videoImageCount:259,
                imageSequence: [0,129],
                canvas_opacity: [1,0,{start:0.9, end:1}],
                next_canvas_opacity: [0,1,{start:0.95, end:1}],
                h1title_opacity_in: [0, 1, { start: 0.1, end: 0.4 }],
                h1title_opacity_out: [1, 0, { start: 0.95, end: 1 }],
                h1title_translateY_in: [20, 0, { start: 0.1, end: 0.4 }],
                h1title_translateY_out: [0, -20, { start: 0.9, end:1 }],
                h1title_scale_out: [1, 0, { start: 0.95, end:1 }],
            }
      };
      sceneInfo[1] = {
        type:"normal",
        scrollHeight:0,
        objs:{
          container: document.querySelector('#scroll-section-1'),
          solution: document.querySelector('#scroll-section-1 .flex-box-mo'),
        },
        values: {
          background_opacity_in:[0,1,{start:0, end:0}],
          background_opacity_out:[1,1,{start:0.95, end:1}],
          solution_opacity_in: [0, 1, { start: 0.0, end: 0.15 }],
          solution_opacity_out: [1, 0, { start: 0.95, end: 1 }],
          solution_translateY_in: [20, -5, { start: 0, end: 0.5 }],
          solution_translateY_out: [-5, -5, { start: 0.9, end: 1 }],
        }
      };
      sceneInfo[2] = {
        type:typeArr[2],
        scrollHeight:0,
        objs:{
          container: document.querySelector('#scroll-section-2'),
          caseWrapper: document.querySelector('#scroll-section-3 .case-wrapper'),
        },
        values: {
          canvas_opacity_in: [0, 1, { start: 0.15, end: 0.2 }],
          canvas_opacity_out: [1, 0, { start: 0.95, end: 1 }],
          case_wrapper_opacity: [0, 1, { start: 0.6, end: 0.95 }],
          case_wrapper_translateY: [110, 0, { start: 0.6, end: 1 }],
        }
      };
      sceneInfo[3] = {
        type:typeArr[3],
        heightNum:2,
        scrollHeight:0,
        objs:{
          container: document.querySelector('#scroll-section-3'),
          caseWrapper: document.querySelector('#scroll-section-3 .case-wrapper'),
          gridWrapper: document.querySelector('#scroll-section-4 .grid-wrapper'),
        },
        values: {
          grid_opacity: [0, 1, { start: 0.5, end: 1 }],
          grid_translateY: [110, 0, { start: 0.5, end: 1 }],
          case_wrapper_opacity: [1, 0, { start: 0.9, end: 0.95 }],
          case_wrapper_translateY: [0, -100, { start: 0.5, end: 1 }],
        }
      };
      sceneInfo[4] = {
        type:typeArr[4],
        heightNum:1.5,
        scrollHeight:0,
        objs:{
          container: document.querySelector('#scroll-section-4'),
          gridWrapper: document.querySelector('#scroll-section-4 .grid-wrapper'),
        },
        values: {
            grid_translateY: [0, 0, { start: 0, end: 0.1 }],
        }
      };

      setCanvasImages();
    }

    
    for(let i=0;i<sceneInfo.length;i++){
      if(sceneInfo[i].type==="sticky") {
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum*window.innerHeight;
      } else if(sceneInfo[i].type==="normal"){
        sceneInfo[i].scrollHeight = sceneInfo[i].objs.container.offsetHeight;
      }
      if(i===3)
        sceneInfo[i].scrollHeight = sceneInfo[i].heightNum*window.innerHeight;

      sceneInfo[i].objs.container.style.height = `${sceneInfo[i].scrollHeight}px`;
    }

    yOffset = window.pageYOffset;
    let totalScrollHeight = 0;
    for(let i =0;i<sceneInfo.length;i++){
        totalScrollHeight += sceneInfo[i].scrollHeight;
        if(totalScrollHeight>=yOffset){
            currentScene = i;
            break;
        }        
    }
    document.body.setAttribute('id',`show-scene-${currentScene}`);

    const heightRatio=window.innerHeight/576;
    const widthRatio=window.innerWidth/1024;

    //jenga & lightbulb 해상도
    const jlHeightRatio=window.innerHeight/1080;
    const jlWidthRatio=window.innerWidth/1920;

    let canvasRatio = heightRatio>widthRatio?heightRatio:widthRatio;
    let jlCanvasRatio = jlHeightRatio>jlWidthRatio?jlHeightRatio:jlWidthRatio;

    if(window.innerWidth>800){
      sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%,0) scale(${canvasRatio})`;

      sceneInfo[1].objs.canvas.style.transform = `scale(${jlCanvasRatio*0.7})`;
      sceneInfo[2].objs.canvas.style.transform = `scale(${jlCanvasRatio*0.5})`;


      document.querySelector('#jenga-blend-canvas').width=document.querySelector('.flex-box-canvas').offsetWidth;
      document.querySelector('#jenga-blend-canvas').height=document.querySelector('.flex-box-canvas').offsetHeight; 
      document.querySelector('#light-blend-canvas').width=document.querySelector('.flex-box-canvas').offsetWidth*1.2;
      document.querySelector('#light-blend-canvas').height=document.querySelector('.flex-box-canvas').offsetHeight;
    }else{
      // sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%,0)`;
      sceneInfo[0].objs.canvas.width="428";
      sceneInfo[0].objs.canvas.height="926";
      sceneInfo[0].objs.canvas.style.transform = `translate3d(-50%,-50%,0)`;
      document.querySelector('#jenga-blend-canvas').width=document.querySelector('.flex-box-canvas').offsetWidth;
      document.querySelector('#jenga-blend-canvas').height=document.querySelector('.flex-box-canvas').offsetHeight+window.innerHeight*0.2; 
      document.querySelector('#light-blend-canvas').width=document.querySelector('.flex-box-canvas').offsetWidth;
      document.querySelector('#light-blend-canvas').height=document.querySelector('.flex-box-canvas').offsetHeight;
    }
  }

  function setCanvasImages() {
    let videoPath = "video";

    if(window.innerWidth<=800){
      videoPath="moVideo";
      // sceneInfo[0].values.videoImageCount = 259;
      // sceneInfo[0].values.imageSequence=[0,259];
    }

    for (let i = 0; i <= sceneInfo[0].values.videoImageCount; i+=2) {
      let imgElem = new Image();
      let temp =String(i+1);

      imgElem.src = `landing/${videoPath}/${temp}.png`;
      sceneInfo[0].objs.videoImages.push(imgElem);
    }
  
    if(window.innerWidth>800){
      for (let i = 0; i <= sceneInfo[1].values.videoImageCount; i+=2) {
        let imgElem = new Image();
        let temp =String(i+1);

        imgElem.src = `landing/jenga/0${temp}.png`;
        
        sceneInfo[1].objs.videoImages.push(imgElem);
      }

      for (let i = 0; i <= sceneInfo[2].values.videoImageCount; i+=2) {
        let imgElem = new Image();
        let temp =String(i+1);

        imgElem.src = `landing/bulb/0${temp}.png`;
        
        sceneInfo[2].objs.videoImages.push(imgElem);
      }
    }
    
  }

  function calcValues(values,currentYOffset){
    let rv;
    //현재 씬에서 스크롤된 범위를 비율로 구하기
    let scrollHeight = sceneInfo[currentScene].scrollHeight;
    let scrollRatio = currentYOffset / sceneInfo[currentScene].scrollHeight;
  
    if (values.length === 3) {
      //start ~end 사이에 애니메이션 실행
          const partScrollStart=values[2].start*scrollHeight;
          const partScrollEnd = values[2].end*scrollHeight;
          const partScrollHeight =partScrollEnd-partScrollStart ;

          if(currentYOffset>=partScrollStart && currentYOffset<=partScrollEnd){
              rv =(currentYOffset-partScrollStart)/partScrollHeight*(values[1]-values[0])+values[0];
          }else if (currentYOffset<partScrollStart){
              rv = values[0];
          }else if (currentYOffset>partScrollEnd){
              rv = values[1];
          }
    }else{
      rv =scrollRatio*(values[1]-values[0])+values[0];
    }
    return rv;
  }
  function playAnimation() {
    const objs = sceneInfo[currentScene].objs;
    const values = sceneInfo[currentScene].values;
    const currentYOffset = yOffset - prevScrollHeight;
    const scrollHeight = sceneInfo[currentScene].scrollHeight;
    const scrollRatio = currentYOffset/scrollHeight; //현재 scene에서 스크롤 진행률
    let sequence;
    
    switch(currentScene) {
      
      case 0 :
          if(scrollRatio<=0.62){
            objs.h1title.style.opacity  = calcValues(values.h1title_opacity_in,currentYOffset);
            objs.h1title.style.transform  = `translate3d(0,${calcValues(values.h1title_translateY_in,currentYOffset)-50}%,0)`;
          } else{
            objs.h1title.style.opacity  = calcValues(values.h1title_opacity_out,currentYOffset);
            objs.h1title.style.transform  = `translate3d(0,-50%,0) scale(${calcValues(values.h1title_scale_out,currentYOffset)})`;
          } 
          break;
      case 1 :
          if(window.innerWidth>800){
            if(scrollRatio<=0.32){
              objs.solutionTitle.style.opacity  = calcValues(values.solution_title_opacity_in,currentYOffset);
              objs.solutionTitle.style.transform  = `translate3d(0,${calcValues(values.solution_title_translateY_in,currentYOffset)}%,0)`;
              objs.container.style.backgroundColor = `rgba(0,0,0,${calcValues(values.background_opacity_in,currentYOffset)})`;
            }else{
              objs.solutionTitle.style.opacity  = calcValues(values.solution_title_opacity_out,currentYOffset);
              objs.container.style.backgroundColor = `rgba(0,0,0,${calcValues(values.background_opacity_out,currentYOffset)})`;
            }  
            if(scrollRatio<=0.47){
              objs.canvas.style.opacity  = calcValues(values.canvas_opacity_in,currentYOffset);
            }else{
              objs.canvas.style.opacity  = calcValues(values.canvas_opacity_out,currentYOffset);
            }

            if(scrollRatio<=0.52) {
              objs.solutionWhy.style.opacity  = calcValues(values.solution_why_opacity_in,currentYOffset);
            }else{
              objs.solutionWhy.style.opacity  = calcValues(values.solution_why_opacity_out,currentYOffset);
            }

            objs.solutionWhy.style.transform  = `translate3d(0,${calcValues(values.solution_why_translateY,currentYOffset)-45}%,0)`;            
            objs.solutionHow.style.transform  = `translate3d(0,${calcValues(values.solution_how_translateY,currentYOffset)-45}%,0)`;
            
            if(scrollRatio<=0.82){
              objs.solutionHow.style.opacity  = calcValues(values.solution_how_opacity_in,currentYOffset);
            }else{
              objs.solutionHow.style.opacity  = calcValues(values.solution_how_opacity_out,currentYOffset);
            }
            
          }else{
            if(scrollRatio<=0.17){
              objs.container.style.backgroundColor = `rgba(0,0,0,${calcValues(values.background_opacity_in,currentYOffset)})`;
              objs.solution.style.opacity  = calcValues(values.solution_opacity_in,currentYOffset);
            }else{
              objs.container.style.backgroundColor = `rgba(0,0,0,${calcValues(values.background_opacity_out,currentYOffset)})`;
              objs.solution.style.opacity  = calcValues(values.solution_opacity_out,currentYOffset);
            }
            if(scrollRatio<=0.52){
              objs.solution.style.transform  = `translate3d(0,${calcValues(values.solution_translateY_in,currentYOffset)}%,0)`;
            }else{
              objs.solution.style.transform  = `translate3d(0,${calcValues(values.solution_translateY_out,currentYOffset)}%,0)`;
            }
          }
        break;
      case 2 :
        if(window.innerWidth>800){

          if(scrollRatio<=0.17){
            objs.solutionTitle.style.opacity  = calcValues(values.solution_title_opacity_in,currentYOffset);
            objs.solutionTitle.style.transform  = `translate3d(0,${calcValues(values.solution_title_translateY_in,currentYOffset)}%,0)`;
          }else{
            objs.solutionTitle.style.opacity  = calcValues(values.solution_title_opacity_out,currentYOffset);
          }

          if(scrollRatio<=0.22){
            objs.canvas.style.opacity  = calcValues(values.canvas_opacity_in,currentYOffset);
          }else{
            objs.canvas.style.opacity  = calcValues(values.canvas_opacity_out,currentYOffset);
          }

          if(scrollRatio<=0.27) {
            objs.solutionWhy.style.opacity  = calcValues(values.solution_why_opacity_in,currentYOffset); 
          }else{
            objs.solutionWhy.style.opacity  = calcValues(values.solution_why_opacity_out,currentYOffset); 
          }
          
          if(scrollRatio<=0.32) {
            objs.solutionWhy.style.transform  = `translate3d(0,${calcValues(values.solution_why_translateY,currentYOffset)-45}%,0)`;
          }
          
          if(scrollRatio<=0.57){
            objs.solutionHow.style.opacity = calcValues(values.solution_how_opacity_in,currentYOffset);
          }else{
            objs.solutionHow.style.opacity = calcValues(values.solution_how_opacity_out,currentYOffset);
          }
          
          if(scrollRatio<=0.62){
            objs.solutionHow.style.transform  = `translate3d(0,${calcValues(values.solution_how_translateY,currentYOffset)-45}%,0)`; 
          }
        }
        
        objs.caseWrapper.style.opacity = calcValues(values.case_wrapper_opacity,currentYOffset);          
        objs.caseWrapper.style.transform = `translate3d(0,${calcValues(values.case_wrapper_translateY,currentYOffset)}%,0)`; 
        
        break;
      case 3 :
          if(scrollRatio<=1){
            objs.gridWrapper.style.opacity = calcValues(values.grid_opacity,currentYOffset);
            objs.caseWrapper.style.opacity = calcValues(values.case_wrapper_opacity,currentYOffset);          
            objs.caseWrapper.style.transform = `translate3d(0,${calcValues(values.case_wrapper_translateY,currentYOffset)}%,0)`; 
            if(window.innerWidth>800){
              objs.gridWrapper.style.transform = `translate3d(-50%,${calcValues(values.grid_translateY,currentYOffset)-40}%,0)`;
            } else {
              objs.gridWrapper.style.transform = `translate3d(-50%,${calcValues(values.grid_translateY,currentYOffset)-46}%,0)`;
            }
          }
        break;
      case 4 :
        if(window.innerWidth>800){
          objs.gridWrapper.style.transform = `translate3d(-50%,${calcValues(values.grid_translateY,currentYOffset)-40}%,0)`;
        }else{
          objs.gridWrapper.style.transform = `translate3d(-50%,${calcValues(values.grid_translateY,currentYOffset)-46}%,0)`;
        }
          
        break;
        }
  }

  function scrollLoop(){
    enterNewScene = false;
    prevScrollHeight = 0;//현재 scene 이전까지의 scene들의 높이 합
    
    //현재 scene이전까지 scene들의 높이의 합을 구하는 for문
    for(let i =0;i<currentScene;i++) {
        prevScrollHeight += sceneInfo[i].scrollHeight;
    }

    //scene이 바뀌는 부분 (scene이 아래로 증가)
    if(delayedYOffset > prevScrollHeight+sceneInfo[currentScene].scrollHeight) {
        enterNewScene =true;
        currentScene++;
        document.body.setAttribute('id','show-scene-'+currentScene)
    }
    //scene이 바뀌는 부분 (scene이 위로 감소)
    if(delayedYOffset < prevScrollHeight) {
        if(currentScene===0) return;
        enterNewScene =true;
        currentScene--;
        document.body.setAttribute('id','show-scene-'+currentScene)
    }
    
    if(enterNewScene) return;

    if(currentScene===3 && !onCase){
      //비디오일때는 안되게
      onCase=true;
      caseIntervalId = setInterval(()=>{
                                          changeImage(caseImageNum%3);
                                          caseImageNum++;
                                        },2000);
    }
    playAnimation();
  }

  function loop() {
    delayedYOffset = delayedYOffset + (yOffset - delayedYOffset)*acc;
    if(!enterNewScene) {
      const currentYOffset = delayedYOffset - prevScrollHeight;
      const values = sceneInfo[currentScene].values;
      const objs = sceneInfo[currentScene].objs;
      if(currentScene === 0){
        let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
        if(objs.videoImages[sequence]){
            objs.context.drawImage(objs.videoImages[sequence],0,0);
        }
      }else if(currentScene ===1 || currentScene ===2){
        
        if(window.innerWidth>800){
          let sequence = Math.round(calcValues(values.imageSequence, currentYOffset));
          if(objs.videoImages[sequence]){

            const heightRatio=window.innerHeight/576;
            const widthRatio=window.innerWidth/1024;
            
            if(heightRatio>widthRatio){
              if(currentScene === 1){
                objs.context.drawImage(objs.videoImages[sequence],0,0,window.innerWidth/2,window.innerHeight/1.5);
              }else{
                objs.context.drawImage(objs.videoImages[sequence],0,0,window.innerWidth/2.4,window.innerHeight/1.5);
              }
            }else{
              if(currentScene === 1){
                objs.context.drawImage(objs.videoImages[sequence],0,0,window.innerWidth/2,window.innerHeight);
              }else{
                objs.context.drawImage(objs.videoImages[sequence],0,0,window.innerWidth/2.4,window.innerHeight);
              }
            }
          }
        }
      }
      }

    rafId = requestAnimationFrame(loop);
    if(Math.abs(delayedYOffset-delayedYOffset) <1){
      cancelAnimationFrame(rafId);
      rafState = false;
    }
  }
  window.addEventListener('scroll', ()=> {
    // document.querySelector('#scroll-section-0 h1').classList.add('active');
    yOffset = window.pageYOffset;
    if(yOffset===0){
      // document.querySelector('#scroll-section-0 h1').classList.remove('active');
    }
    scrollLoop();
    if(!rafState){
      rafId = requestAnimationFrame(loop);
      rafState=true;
    }
  });

  
  setCanvasImages();
  window.addEventListener('load', ()=>{
    
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    setLayout();

    sceneInfo[0].objs.context.drawImage(sceneInfo[0].objs.videoImages[0],0,0); 

    

    
    document.body.classList.remove('before-load');
    
    

    window.addEventListener('resize', () => {
      if(window.innerWidth>800){
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
        setTimeout(() => {
          window.location.reload();
        }, 150);
      }
    });
    
  });

  document.querySelector('.loading').addEventListener('transitionend',(e)=>{
    document.body.removeChild(e.currentTarget);
  })
  let end = new Date();  // 종료
  // console.log(end - start,"ms -> 천분의 일초"); 
})();

function categorySelect(type,num) {

  const categories = document.querySelectorAll('.category-content')
  const moCategories = document.querySelectorAll('.category-content-mo')
  const section5 = document.querySelector('#scroll-section-5')
  const videoTag = document.querySelector('.portfolio-video')
  categories.forEach(elem=>{
    elem.classList.remove('active')
  })
  moCategories.forEach(elem=>{
    elem.classList.remove('active')
  })

  if(type==='photo'){
    const photoCategory = document.querySelectorAll('.category-photo');
    const moPhotoCategory = document.querySelectorAll('.category-photo-mo');
    photoCategory[num].classList.add('active');
    moPhotoCategory[num].classList.add('active');
    videoTag.setAttribute('src','');
    if(num===0){
      section5.style.backgroundImage="url('./landing/category/interior.jpg')";
    }else if(num===1){
      section5.style.backgroundImage="url('./landing/category/food.png')";
    }else if(num===2){
      section5.style.backgroundImage="url('./landing/category/product.jpg')";
    }else if(num===3){
      section5.style.backgroundImage="url('./landing/category/event.jpg')";
    }else if(num===4){
      section5.style.backgroundImage="url('./landing/fashion.jpg')";
    }else if(num===5){
      section5.style.backgroundImage="url('./landing/profile.jpg')";
    }
    
  }else if(type==='video'){
    const videoCategory = document.querySelectorAll('.category-video');
    const moVideoCategory = document.querySelectorAll('.category-video-mo');
    
    videoCategory[num].classList.add('active');
    moVideoCategory[num].classList.add('active');

    if(window.innerWidth<=800){
      section5.style.backgroundImage="url('./landing/category/videoBack.jpg')";
    }else{
      section5.style.backgroundImage="url('./landing/category/black.png')";
    }

    if(num===0){
      videoTag.setAttribute('src', './landing/category/video/company.mp4');
    }else if(num===1){
      videoTag.setAttribute('src', './landing/category/video/viral.mp4');
    }else if(num===2){
      videoTag.setAttribute('src', './landing/category/video/interview.mp4');
    }else if(num===3){
      videoTag.setAttribute('src', './landing/category/video/product.mp4');
    }else if(num===4){
      videoTag.setAttribute('src', './landing/category/video/motion.mp4');
    }else if(num===5){
      videoTag.setAttribute('src', './landing/category/video/event.mp4');
    }
  }
}



const caseTitle = [
  "여기어때",
  "망고<br/>플레이트",
  "희망<br/>브릿지",
  "지냄",
  "Avengers</br>Station",
  "AIMS",
  "Ohora"
];
const needsArr = [
  "서울·경기·인천 지역 가맹 숙박업소의 내 외관 및 부대시설 촬영",
  "전국 제휴 음식점의 메뉴 및 내 외관 촬영",
  "재난 재해 발생에 따른 긴급 구호 활동 사진·영상 촬영",
  "서울·제주 지역 가맹 숙박업소의 내 외관 및 부대시설 촬영",
  "국내 첫 어벤져스 스테이션 홍보 사진·영상 제작",
  "투자 설명회에서 깊은 인상을 줄 수 있는 기업 소개 영상 제작",
  "단기간 내 브랜드 이미지를 효과적으로 나타낼 수 있는 고품질 광고 제작"
];
const offerArr = [
  "여기어때 톤앤매너에 맞춘 고품질 결과물 지속 제공",
  "전국 공급망을 바탕으로 국내 전 지역 제휴 매장의 음식, 내 외관 촬영 진행",
  "전국 공급자망을 바탕으로 국내 전 지역 긴급 촬영 공급",
  "촬영 가이드라인 수립부터 촬영 스케줄링, 결과물 전달까지 원-스톱 솔루션 제공",
  "마케팅 켐페인에 맞춘 고품질 사진·영상 제작 전담",
  "영상 기획 및 국내 탑 티어 모션그래픽 제작자 연결을 통한 고품질 기업 소개 영상 제작",
  "효과적인 촬영 매니지먼트를 통해 단기간 내 만족스러운 고품질 광고 납품"
];
const nickArr = [
  "대한민국 1등 종합 숙박앱",
  "대한민국 1등 맛집 추천/검색앱",
  "재난 구호모금 전문기관",
  "중소형 숙박업 종합 솔루션",
  "마블 어벤져스 스테이션 체험관",
  "나노 배터리 EV 모빌리티 기업",
  "네일아트 브랜드",
  "나노 배터리 EV 모빌리티 기업"
];


const caseImageArr = [
  [
    "./landing/case/howabouthere/1.png",
    "./landing/case/howabouthere/2.png",
    "./landing/case/howabouthere/3.png",
  ],
  [
    "./landing/case/mp/1.png",
    "./landing/case/mp/2.png",
    "./landing/case/mp/3.png",
  ],
  [
    "./landing/case/happy/1.png",
    "./landing/case/happy/2.png",
    "./landing/case/happy/3.png"
  ],
  [
    "./landing/case/jienem/1.png",
    "./landing/case/jienem/2.png",
    "./landing/case/jienem/3.png"
  ]
]




function caseSelect(num) {
  const caseContents = document.querySelectorAll('.case-content')
  const caseName = document.querySelector('.case-study-name-title')
  const caseImage = document.querySelector('.case-study-image')
  const caseVideo = document.querySelector('.case-video')
  const caseNeeds = document.querySelector('.case-study-needs-content')
  const caseOffer = document.querySelector('.case-study-offer-content')
  const caseNick = document.querySelector('.case-study-name-nick')


  caseContents.forEach(elem=>{
    elem.classList.remove('active');
  })
  caseVideo.setAttribute('src', '');
  caseContents[num].classList.add('active');
  
  caseNum = num;
  caseImageNum=0;
  changeImage(0);

  if(num>3){
    document.querySelector('.case-study-image-number-wrapper').style.display = "none";
  }else{
    document.querySelector('.case-study-image-number-wrapper').style.display = "block";
  }

  if(num===0){  
  caseImage.style.backgroundImage="url('./landing/case/howabouthere/1.png')";
  }else if(num===1){
    caseImage.style.backgroundImage="url('./landing/case/mp/1.png')";
  }else if(num===2){
    caseImage.style.backgroundImage="url('./landing/case/happy/1.png')";
  }else if(num===3){
    caseImage.style.backgroundImage="url('./landing/case/jienem/1.png')";
  }else if(num===4){
    caseImage.style.backgroundImage="url('')";
    caseVideo.setAttribute('src', './landing/case/avengers.mp4');
  }else if(num===5){
    caseImage.style.backgroundImage="url('')";
    caseVideo.setAttribute('src', './landing/case/aims.mp4');
  }else if(num===6){
    caseImage.style.backgroundImage="url('')";
    caseVideo.setAttribute('src', './landing/case/ohora.mp4');
  }
  caseNick.innerHTML = `${nickArr[num]}`;
  caseName.innerHTML = `${caseTitle[num]}`;
  caseNeeds.innerHTML = `${needsArr[num]}`;
  caseOffer.innerHTML = `${offerArr[num]}`;
}

function changeImage(num) {
  const premiums = document.querySelectorAll('.case-premium')

  let flag = true;
  premiums.forEach(elem=>{
    if(elem.classList.contains('active')){
      flag=false;
      return;
    }
  })

  if(flag){
    const caseImage = document.querySelector('.case-study-image');
    const caseNumbers = document.querySelectorAll('.case-study-image-number');
    
    caseNumbers.forEach(elem=>{
      elem.classList.remove('active');
    })


    caseNumbers[num].classList.add('active');
    caseImage.style.backgroundImage=`url(${caseImageArr[caseNum][num]})`;
  }
  

  
}