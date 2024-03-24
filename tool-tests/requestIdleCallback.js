let taskId = 0;

/**
 * 任务循环
 * @param {IdleDeadline} deadline
 */
function workLoop(deadline) {
  let shouldYield = false;
  ++taskId;
  while (!shouldYield) {
    console.log(`taskId: ${taskId}`);
    shouldYield = deadline.timeRemaining() < 1;
  }

  // requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);
