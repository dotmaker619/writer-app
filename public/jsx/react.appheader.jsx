class AppHeader extends React.Component {
    render() {
        return (
            const {user} = this.props;

            <header>
                <nav>
                    <ul className="menu-nav">
                        <li>
                            <a className="logo" href="/">Biblatio</a>
                        </li>
                        <li>
                            <!--TODO class=context.path.toLowerCase().indexOf('tasks') !== -1 ? "active" : "")-->
                            <a className="" href="/app/tasks">My Tasks</a>
                        </li>
                        <li>
                            <!--TODO class=context.path.toLowerCase().indexOf('tools') !== -1 ? "active" : "")-->
                            <a className="" href="/app/tools">Tools</a>
                        </li>
                    </ul>
                    <ul className="user-nav">
                        <li>
                            <p>{user.username}<b>%nbsp;{user.kudos}</b></p>
                        </li>
                        <li className="user">
                            <img className="user_avatar small" src="{user.avatar}"/>
                        </li>
                        <ul className="user_sub_menu">
                            <li>
                                <a href="/app/profile">My Profile</a>
                            </li>
                            <li>
                                <a href="password">Change Password</a>
                            </li>
                            <li>
                                <a href="/app/logout">Logout</a>
                            </li>
                        </ul>
                        </ul>
                    </ul>
                </nav>
            </header>
        )
    }
}

