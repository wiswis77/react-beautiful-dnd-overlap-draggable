import React, {Fragment, useState, useCallback} from 'react';
import styled from "styled-components";

import uuid from "uuid4";
import {DragDropContext, Droppable, Draggable} from "react-beautiful-dnd";
// import {DragDropContext, Droppable, Draggable} from '@hello-pangea/dnd';
import useForceUpdate from "use-force-update";

// Tool<>Form
const ToolFormContainer = styled.div`
    display: flex;
    flex-direction:row;
    padding: 0.5rem;
`;
// tool
const ToolContainer = styled.div`
    display: flex;
    flex-direction:column;
    border: 1px solid;
    margin: 0.5rem;
    padding: 0.5rem;
`;
// tool 정렬 : 세로
const Tool = styled.div`
    display: flex;
    flex-direction:column;
    border: 1px dashed;
    background-color: ${(props) => (props.isDragging ? "lightgreen" : "white")};
    margin: 0.5rem;
    padding: 0.5rem;
`;
const ToolClone = styled(Tool)`
    ~ div {
        transform: none !important;
    }
`;
// section 정렬 : 세로
const FormContainer = styled.div`
    // display: flex;
    // flex-direction:column;
    border: 1px solid;
    background-color: ${(props) => props.isDraggingOver ? "skyblue" : "inherit"};
    margin: 0.5rem;
    padding: 0.5rem;
`;
// layout 정렬 : 가로
const SectionContainer = styled.div`
    display: flex;
    flex-direction:row;
    border: 1px dashed;
    background-color: ${(props) => (props.isDragging) ? "lightgreen" : "white"};
    margin: 0.5rem;
    padding: 0.5rem;
`;
// control 정렬 : 세로
const LayoutContainer = styled.div`
    // display: flex;
    // flex-direction:column;
    border: 1px solid;
    background-color: ${(props) => props.isDraggingOver ? "skyblue" : "white"};
    margin: 0.5rem;
    padding: 0.5rem;
`;
//
const Control = styled.div`
    border: 1px dashed;
    background-color: white;
    margin: 0.5rem;
    padding: 0.5rem;
`;

const model = {
    tools: [
        {
            id: uuid(),
            content: 'tool0',
        },
        {
            id: uuid(),
            content: 'tool1',
        },
        {
            id: uuid(),
            content: 'tool2',
        }
    ],
    formName: 'form1',
    sections: [
        {
            id: uuid(),
            content: 'section0',
            layouts: [
                {
                    id: uuid(),
                    content: 'layout0',
                    controls: [
                        {
                            id: uuid(),
                            content: 'control0'
                        }
                    ]
                }
            ]
        },
        {
            id: uuid(),
            content: 'section1',
            layouts: [
                {
                    id: uuid(),
                    content: 'layout1',
                    controls: [
                        {
                            id: uuid(),
                            content: 'control1'
                        },
                        {
                            id: uuid(),
                            content: 'control2'
                        }
                    ]
                },
                {
                    id: uuid(),
                    content: 'layout2',
                    controls: [
                        {
                            id: uuid(),
                            content: 'control3'
                        },
                    ]
                },
                {
                    id: uuid(),
                    content: 'layout3',
                    controls: [
                        {
                            id: uuid(),
                            content: 'control4',
                        },
                        {
                            id: uuid(),
                            content: 'control5',
                        },
                        {
                            id: uuid(),
                            content: 'control6'
                        }
                    ]
                }
            ]
        },
        {
            id: uuid(),
            content: 'section2',
            layouts: [
                {
                    id: uuid(),
                    content: 'layout4',
                    controls: [
                        {
                            id: uuid(),
                            content: 'control7'
                        },
                        {
                            id: uuid(),
                            content: 'control8'
                        }
                    ]
                },
                {
                    id: uuid(),
                    content: 'layout5',
                    controls: [
                        {
                            id: uuid(),
                            content: 'control9'
                        }
                    ]
                }
            ]
        }
    ]
};

function ControlPanel3() {
    // console.log('[ControlPanel3] START');
    // console.log('[ControlPanel3] model', model);

    const [dropModeSection, setDropModeSection] = useState(false);
    const [dropModeLayout,  setDropModeLayout]  = useState(false);

    const CopySection = (result) => {
        console.log('[CopySection] START');
        const { source, destination } = result;

        const sourceSectionClone = {
            id: '',
            content: 'section' + source.index + 'Temp',
            layouts: [
                {
                    id: '',
                    content: 'layout' + source.index + 'Temp',
                    controls: [
                    ]
                }
            ]
        };
        sourceSectionClone.id = uuid();
        sourceSectionClone.layouts[0].id = uuid();
        
        model.sections.splice(destination.index, 0, sourceSectionClone);

        return{

        };
    };

    const CopyControl = (result) => {
        console.log('[CopyControl] START');
        const { source, destination } = result;

        const sourceControlClone = {
            id: '',
            content: 'control' + source.index + 'Temp',
        };
        sourceControlClone.id = uuid();

        let flag = false;
        for( let n=0 ; n<model.sections.length ; n++ ){
            if(flag) break;

            for( let m=0 ; m<model.sections[n].layouts.length ; m++){
                if(model.sections[n].layouts[m].id === destination.droppableId){
                    model.sections[n].layouts[m].controls.splice(destination.index, 0, sourceControlClone);
                    flag = true;
                    break;
                }
            }
        }

        return{

        };
    };

    const MoveSection = (result) => {
        console.log('[MoveSection] START');
        const { source, destination } = result;

        //const sourceSectionClone = Array.from(model.sections)[source.index];
        const sourceSectionClone = model.sections[source.index];

        model.sections
            .splice(source.index, 1);
        model.sections
            .splice(destination.index, 0, sourceSectionClone);

        return{

        };
    };

    const MoveControl = (result) => {
        console.log('[MoveControl] START');
        const { source, destination } = result;

        if(source.droppableId === destination.droppableId) {
            let flag = false;
            for( let n=0 ; n<model.sections.length ; n++ ){
                if(flag)
                    break;

                for( let m=0 ; m<model.sections[n].layouts.length ; m++){
                    if(model.sections[n].layouts[m].id === source.droppableId){
                        const sourceControlClone1 = model.sections[n].layouts[m].controls[source.index];
                        model.sections[n].layouts[m].controls
                            .splice(source.index, 1);
                        model.sections[n].layouts[m].controls
                            .splice(destination.index, 0, sourceControlClone1);

                        flag = true;
                        break;
                    }
                }
            }
        }
        else{ // if(source.droppableId !== destination.droppableId)
            let flag1 = false;
            let flag2 = false;
            let sourceControlClone2 = {};

            // get Model & Delete source
            for( let n1=0 ; n1<model.sections.length ; n1++ ){
                if(flag1)
                    break;

                for( let m1=0 ; m1<model.sections[n1].layouts.length ; m1++){
                    if(model.sections[n1].layouts[m1].id === source.droppableId){
                        sourceControlClone2 = Array.from(model.sections[n1].layouts[m1].controls)[source.index];
                        model.sections[n1].layouts[m1].controls
                            .splice(source.index, 1);

                        flag1 = true;
                        break;
                    }
                }
            }
            console.log('[MoveControl] sourceControlClone2-1', sourceControlClone2);

            // set Model
            for( let n2=0 ; n2<model.sections.length ; n2++ ){
                if(flag2)
                    break;

                for( let m2=0 ; m2<model.sections[n2].layouts.length ; m2++){
                    if(model.sections[n2].layouts[m2].id === destination.droppableId){
                        model.sections[n2].layouts[m2].controls
                            .splice(destination.index, 0, sourceControlClone2);

                        flag2 = true;
                        break;
                    }
                }
            }
        }

        return{

        };
    };

    const forceUpdate = useForceUpdate();

    const AddSection = (e, index) => {
        // console.log('[AddSection] START');
        // console.log('[AddSection] index', index);

        let sourceSectionClone = {
            id: '',
            content: 'section' + index + 'Temp',
            layouts: [
                {
                    id: '',
                    content: 'layoutTemp',
                    controls: [
                    ]
                }
            ]
        };

        if(index !== 0){
            sourceSectionClone.layouts[0].controls
                .push({
                    id: uuid(),
                    content: 'control' + index + 'Temp'
                });
        }

        sourceSectionClone.id = uuid();
        sourceSectionClone.layouts[0].id = uuid();

        model.sections.splice((model.sections.length), 0, sourceSectionClone);

        forceUpdate();

        return{

        };
    };

    const onDragStart = (result) => {
        // console.log('[onDragStart] START');

        const { source } = result;
        // console.log('[onDragStart] source', source);

        if(source.droppableId === 'TOOLS'){
            if(source.index === 0){
                console.log('[onDragStart] source.index === 0', source.index);
                setDropModeSection(false);
                setDropModeLayout(true);
            }
            else{
                console.log('[onDragStart] source.index !== 0', source.index);
                setDropModeSection(true);
                setDropModeLayout(false);
            }
        }
        else if(source.droppableId === 'FORM'){
            setDropModeSection(false);
            setDropModeLayout(true);
        }
        else {
            setDropModeSection(true);
            setDropModeLayout(false);
        }
    };

    const onDragEnd = (result) => {
        console.log('[onDragEnd] START');
        const { source, destination } = result;

        if(!destination){
            return;
        }
        // console.log('[onDragEnd] result', result);
        // console.log('[onDragEnd] source', source);
        // console.log('[onDragEnd] destination', destination);

        if( source.droppableId === 'TOOLS' && destination.droppableId === 'FORM' ){
            // console.log('copy TOOLS to FORM');
            CopySection(result);
        }
        else if( source.droppableId === 'TOOLS' && destination.droppableId !== 'FORM' ){
            // console.log('copy TOOLS to LAYOUT');
            CopyControl(result);
        }
        else if( source.droppableId === 'FORM' && destination.droppableId === 'FORM' ){
            // console.log('copy SECTION to FORM');
            MoveSection(result);
        }
        else if( source.droppableId !== 'TOOLS' &&
                 ( source.droppableId === destination.droppableId ||
                   source.droppableId !== destination.droppableId ) ){
            // console.log('copy CONTROL to SAME or DIFFER LAYOUT');
            MoveControl(result);
        }
    };

    return (
        <Fragment>
            <DragDropContext
                onDragStart={onDragStart}
                onDragEnd  ={onDragEnd}
            >
                <ToolFormContainer>
                    <Droppable
                        droppableId={'TOOLS'}
                        isDropDisabled={true}
                    >
                        { (provided) => (
                            <ToolContainer
                                ref={provided.innerRef}
                            >
                                { model.tools.map((tool, toolIndex) => {
                                    // console.log('[model.tools.map] toolIndex, tool', toolIndex, tool);

                                    return(
                                        <Draggable
                                            key={tool.id}
                                            index={toolIndex}
                                            draggableId={tool.id}
                                        >
                                            { (provided, snapshot) => (
                                                <Fragment>
                                                    <Tool
                                                        ref={provided.innerRef}
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        isDragging={snapshot.isDragging}
                                                        style={provided.draggableProps.style}
                                                        onClick={(e) => {
                                                            AddSection(e, toolIndex);
                                                        }}
                                                    >
                                                        [{tool.content}]<br/>[{tool.id.substring(0,3) + '..'}]
                                                    </Tool>
                                                    {snapshot.isDragging && (
                                                        <ToolClone>
                                                            [{toolIndex}][{tool.content}]<br/>[{tool.id.substring(0,3) + '..'}]
                                                        </ToolClone>
                                                    )}
                                                </Fragment>
                                            )}
                                        </Draggable>
                                    );
                                } ) }
                                {provided.placeholder}
                            </ToolContainer>
                        ) }
                    </Droppable>
                    <Droppable
                        droppableId={'FORM'}
                        isDropDisabled={dropModeSection}
                        direction={'vertical'}
                    >
                        { (provided, snapshot) => {
                            console.log('[Droppable1] dropModeSection, dropModeLayout', dropModeSection, dropModeLayout);

                            return(
                                <FormContainer
                                    ref={provided.innerRef}
                                    {...provided.droppableProps}
                                    isDraggingOver={snapshot.isDraggingOver}
                                >
                                    [{model.formName}]
                                    {model.sections.map((section, sectionIndex) => {
                                        // console.log('[model.sections.map()] section', section);

                                        return (
                                            <Draggable
                                                key={section.id}
                                                index={sectionIndex}
                                                draggableId={section.id}
                                            >
                                                {(provided, snapshot) => (
                                                    <SectionContainer
                                                        {...provided.draggableProps}
                                                        {...provided.dragHandleProps}
                                                        ref={provided.innerRef}
                                                        isDragging={snapshot.isDragging}
                                                        style={provided.draggableProps.style}
                                                    >
                                                        [{section.content}]<br/>[{section.id.substring(0, 4) + '..'}]

                                                        {section.layouts.map((layout, layoutIndex) => {
                                                            // console.log('[section.layouts.map()] layout', layout);

                                                            return (
                                                                <Droppable
                                                                    key={layout.id}
                                                                    index={layoutIndex}
                                                                    droppableId={layout.id}
                                                                    direction={'vertical'}
                                                                    isDropDisabled={dropModeLayout}
                                                                >
                                                                    {(provided, snapshot) => (
                                                                        <LayoutContainer
                                                                            {...provided.droppableProps}
                                                                            ref={provided.innerRef}
                                                                            isDraggingOver={snapshot.isDraggingOver}
                                                                        >
                                                                            [{layout.content}]<br/>[{layout.id.substring(0, 4) + '..'}]
                                                                            {layout.controls.map((control, controlIndex) => {
                                                                                // console.log('[layout.controls.map()] control', control);

                                                                                return (
                                                                                    <Draggable
                                                                                        key={control.id}
                                                                                        index={controlIndex}
                                                                                        draggableId={control.id}
                                                                                    >
                                                                                        {(provided, snapshot) => {
                                                                                            return (
                                                                                                <Control
                                                                                                    {...provided.draggableProps}
                                                                                                    {...provided.dragHandleProps}
                                                                                                    ref={provided.innerRef}
                                                                                                    isDragging={snapshot.isDragging}
                                                                                                    style={provided.draggableProps.style}
                                                                                                >
                                                                                                    [{control.content}]<br/>[{control.id.substring(0, 4) + '..'}]
                                                                                                </Control>
                                                                                            );
                                                                                        }}
                                                                                    </Draggable>
                                                                                );
                                                                            })}
                                                                            {provided.placeholder}
                                                                        </LayoutContainer>
                                                                    )}
                                                                </Droppable>
                                                            );
                                                        })}
                                                    </SectionContainer>
                                                )}
                                            </Draggable>
                                        );
                                    })}
                                    {provided.placeholder}
                                </FormContainer>
                            );
                        }}
                    </Droppable>
                </ToolFormContainer>
            </DragDropContext>
        </Fragment>
    );
}

export default ControlPanel3;




