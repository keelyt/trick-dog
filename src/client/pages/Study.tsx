import { useSearchParams } from 'react-router-dom';

import StudyReviewer from './StudyReviewer';
import StudySelection from './StudySelection';

export default function Study() {
  const [selectionParam, setSelectionParam] = useSearchParams();

  const selection = selectionParam.get('sel');

  return selection ? (
    <StudyReviewer selection={selection} />
  ) : (
    <StudySelection setSelectionParam={setSelectionParam} />
  );
}
