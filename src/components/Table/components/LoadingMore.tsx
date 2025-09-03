import LoadingItem from './LoadingItem';

export default function LoadingMore() {
  return Array.from(new Array(10)).map((_, index) => (
    <LoadingItem key={index} />
  ));
}
