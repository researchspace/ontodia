import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Workspace, WorkspaceProps, DemoDataProvider } from '../index';

import { onPageLoad, tryLoadLayoutFromLocalStorage, saveLayoutToLocalStorage } from './common';

require('jointjs/css/layout.css');
require('jointjs/css/themes/default.css');

export interface Props {
    onForceLayout?: () => void;
    onFlowLayout?: () => void;
}

const CLASS_NAME = 'ontodia-toolbar';

export class Toolbar extends React.Component<Props, void> {
    private downloadImageLink: HTMLAnchorElement;

    render() {
        return (
            <div className={CLASS_NAME}>
                <div className='ontodia-btn-group ontodia-btn-group-sm'
                     data-position='bottom' data-step='6'>
                    <span className={`${CLASS_NAME}__layout-group`}>
                        <label className='ontodia-label'><span>Layout - </span></label>
                        <span className='ontodia-btn-group ontodia-btn-group-sm'>
                            <button type='button' className='ontodia-btn ontodia-btn-default'
                                    onClick={this.props.onForceLayout}>
                                <span title='Force layout' className='fa fa-snowflake-o' aria-hidden='true' />
                            </button>
                            <button type='button' className='ontodia-btn ontodia-btn-default'
                                    onClick={this.props.onFlowLayout}>
                                <span title='Flow layout' className='fa fa-sitemap' aria-hidden='true' />
                            </button>
                        </span>
                    </span>
                </div>
            </div>
        );
    }
}

function onWorkspaceMounted(workspace: Workspace) {
    if (!workspace) { return; }

    const model = workspace.getModel();
    model.graph.on('action:iriClick', (iri: string) => console.log(iri));

    const layoutData = tryLoadLayoutFromLocalStorage();
    model.importLayout({layoutData, dataProvider: new DemoDataProvider(), validateLinks: true});
}

const props: WorkspaceProps & React.ClassAttributes<Workspace> = {
    ref: onWorkspaceMounted,
    onSaveDiagram: workspace => {
        const {layoutData} = workspace.getModel().exportLayout();
        window.location.hash = saveLayoutToLocalStorage(layoutData);
        window.location.reload();
    },
    toolbar: <Toolbar/>,
};

onPageLoad(container => ReactDOM.render(React.createElement(Workspace, props), container));
