import { getTodos, saveTodo } from "../libs/actions/todos/todo"


export default async function Home() {
  const todos =  await getTodos()
  console.log(todos);
  
  return (
    <section>
      <form action={async(formdata)=>{
        "use server"
        const { todo }  = Object.fromEntries(formdata)
        
        if (todo.length > 0) {
          const result = await saveTodo(todo)
          if (result?.error) {
            console.log(result?.error);
          } else {
            console.log("success");
          }
          
        } else {
          console.log("Invalid Input");
          
        }
        
      }}>
        <input type="text" name="todo"  id="todo"/>
        <button type="submit">Add Todo</button>
      </form>
      <section>
        {todos.length > 0 ? <main>
          {todos?.map(todo=>{
            const {_id, title}= todo
            return <h2 key={_id}>{title}</h2>
          })}
        </main>: <h2>No Todo Found</h2>}
      </section>
    </section>
  );
}
