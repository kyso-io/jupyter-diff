import { defaultSanitizer } from '@jupyterlab/apputils';
import { MathJaxTypesetter } from '@jupyterlab/mathjax2';
import * as nbformat from '@jupyterlab/nbformat';
import { RenderMimeRegistry } from '@jupyterlab/rendermime';
import { Panel, Widget } from '@lumino/widgets';
import axios from 'axios';
import { IDiffEntry } from 'nbdime/lib/diff/diffentries';
import { NotebookDiffModel } from 'nbdime/lib/diff/model';
import { NotebookDiffWidget } from 'nbdime/lib/diff/widget';
import { useEffect, useState } from 'react';
import { rendererFactories } from '../utils/rendermime';

import '@fortawesome/fontawesome-free/css/all.min.css';
import '@fortawesome/fontawesome-free/css/v4-shims.min.css';

import '@jupyterlab/codemirror/style/index.css';
import 'codemirror/lib/codemirror.css';

import '@jupyterlab/notebook/style/index.css';
import '@jupyterlab/theme-light-extension/style/theme.css';

import 'nbdime/lib/common/collapsible.css';
import 'nbdime/lib/common/dragpanel.css';
import 'nbdime/lib/styles/common.css';
import 'nbdime/lib/styles/diff.css';
import 'nbdime/lib/styles/merge.css';
import 'nbdime/lib/styles/variables.css';
import 'nbdime/lib/upstreaming/flexpanel.css';
import { useCookies } from 'react-cookie';
import { useSearchParams } from 'react-router-dom';

interface ApiResult {
  base: nbformat.INotebookContent;
  diff: IDiffEntry[];
}

const JupyterNotebookDiffs = () => {
  const [apiResult, setApiResult] = useState<ApiResult | null>(null);
  const [searchParams] = useSearchParams();
  const [cookies] = useCookies(['kyso-jwt-token']);

  useEffect(() => {
    const sourceFileId: string | null = searchParams.get('sourceFileId');
    const targetFileId: string | null = searchParams.get('targetFileId');
    const token: string | null = cookies.hasOwnProperty('kyso-jwt-token') && cookies['kyso-jwt-token'] ? cookies['kyso-jwt-token'] : null;
    if (!sourceFileId || !targetFileId || !token) {
      console.log({ sourceFileId, targetFileId, token });
      return;
    }
    axios
      .get(`/api/v1/reports/diff/63a18b7f9e035917e4cd9d84?sourceFileId=${sourceFileId}&targetFileId=${targetFileId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        setApiResult(res.data.data);
      });
  }, [cookies, searchParams]);

  useEffect(() => {
    if (!apiResult) {
      return;
    }
    showDiff();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiResult]);

  const showDiff = () => {
    let rendermime = new RenderMimeRegistry({
      initialFactories: rendererFactories,
      sanitizer: defaultSanitizer,
      latexTypesetter: new MathJaxTypesetter({
        url: 'https://cdn.jsdelivr.net/npm/mathjax@2/MathJax.js',
        config: 'TeX-AMS-MML_HTMLorMML-full,Safe',
      }),
    });
    const nbdModel = new NotebookDiffModel(apiResult!.base as any, apiResult!.diff);
    const nbdWidget = new NotebookDiffWidget(nbdModel, rendermime);
    let root = document.getElementById('nbdime-root');
    if (!root) {
      throw new Error('Missing root element "nbidme-root"');
    }
    root.innerHTML = '';
    let panel = new Panel();
    panel.id = 'main';
    Widget.attach(panel, root);
    panel.addWidget(nbdWidget as any);
    let work = nbdWidget.init();
    work.then(() => {
      window.onresize = () => {
        panel.update();
      };
    });
    // diffWidget = nbdWidget;
    // return work;
  };

  return <div id="nbdime-root" className="nbdime-root"></div>;
};

export default JupyterNotebookDiffs;
