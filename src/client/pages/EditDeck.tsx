import { useParams } from 'react-router-dom';

export default function EditDeck() {
  const { deckId } = useParams();
  return <div>EditDeck {deckId}</div>;
}
