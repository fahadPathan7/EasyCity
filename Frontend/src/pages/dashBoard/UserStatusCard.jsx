export default function UserStatusCard({title, number}) {

    return <>
        <div className="user-status-card">
                {title} <br />
                <span>{number}</span>
              </div>
    </>;

}