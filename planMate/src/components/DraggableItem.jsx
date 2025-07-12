// components/DraggableItem.jsx
import { useDrag } from 'react-dnd'

const DraggableItem = ({ item }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: item.type,
    item,
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging()
    })
  }))

  return (
    <div
      ref={drag}
      className={`p-2 m-1 border rounded shadow ${
        isDragging ? 'opacity-50' : ''
      }`}
    >
      {item.title}
    </div>
  )
}

export default DraggableItem
