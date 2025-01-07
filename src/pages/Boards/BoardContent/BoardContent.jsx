import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import ListColumns from "./ListColumns/ListColumns";
import { mapOrder } from "~/utils/sorts";
import {
  DndContext,
  MouseSensor,
  TouchSensor,
  // if U want to use pointerSensor U have to use additional css value "touch-action: 'none'" which U defined in Css-custom-dndKit
  PointerSensor, 
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";

function BoardContent({ board }) {
  const [orderedColumns, SetOrderedColumns] = useState([]);

  useEffect(() => {
    SetOrderedColumns(mapOrder(board?.columns, board?.columnOrderIds, "_id"));
  }, [board]);

  // Defined one point
  const mouseSensor = useSensor(MouseSensor, {
    activationConstraint: { distance: 10 }, // Require the mouse to move by 10 pixels before activating
  });
  const touchSensor = useSensor(TouchSensor, {
    activationConstraint: { delay: 250, tolerance: 500 }, // tolerance ~~ zoomSize of point
  });
  // Use many points, *Recommended to use both mouse and touch sensor for smooth experience on mobile devices
  const mySensors = useSensors(mouseSensor, touchSensor);

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (!over) return;
    if (active.id !== over.id) {
      // get old index
      const oldIndex = orderedColumns.findIndex((i) => i._id === active.id);
      // get new index
      const newIndex = orderedColumns.findIndex((i) => i._id === over.id);
      // use arrayMove of dndKit to sort array of original column
      const dndOrderedColumns = arrayMove(orderedColumns, oldIndex, newIndex);
      // const dndOrderedColumnsIds = dndOrderedColumns.map((i) => i._id); use to update _id_sort api
      SetOrderedColumns(dndOrderedColumns);
    }
  };

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={mySensors}>
      <Box
        maxWidth
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#34495e" : "#1976d2",
          height: (theme) => theme.trello.boardContentHeight,
          p: "10px 0",
        }}
      >
        <ListColumns columns={orderedColumns} />
      </Box>
    </DndContext>
  );
}

export default BoardContent;
