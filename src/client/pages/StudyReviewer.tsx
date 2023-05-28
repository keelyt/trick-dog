import { Link } from 'react-router-dom';

export default function StudyReviewer({ selection }: { selection: string }) {
  return (
    <div>
      <Link to='/study' state={{ selection }}>
        Modify Selection
      </Link>
      <h1>Review your cards:</h1>
    </div>
  );
}
